import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Config } from '@constants/config';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { SituationSearch } from '@models/situation-search';
import { LangService } from '@services/lang.service';
import { SituationSearchService } from '@services/situation-search.service';
import { ignoreErrors } from '@utils/utils';
import {
  catchError,
  exhaustMap,
  of,
  Subject,
  switchMap,
  takeUntil,
  throwError,
} from 'rxjs';
import { MawaredEmployee } from '@models/mawared-employee';
import { Offender } from '@models/offender';
import { DatePipe, LocationStrategy } from '@angular/common';
import { ProofTypes } from '@enums/proof-types';
import { OffenderTypes } from '@enums/offender-types';
import { ClearingAgent } from '@models/clearing-agent';
import { ClearingAgency } from '@models/clearing-agency';
import { CaseTypes } from '@enums/case-types';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OpenFrom } from '@enums/open-from';
import { AppFullRoutes } from '@constants/app-full-routes';
import { EncryptionService } from '@services/encryption.service';
import { Router } from '@angular/router';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { InvestigationService } from '@services/investigation.service';
import { FormBuilder, FormGroup, UntypedFormControl } from '@angular/forms';
import { LookupService } from '@services/lookup.service';

@Component({
  selector: 'app-situation-search',
  templateUrl: './situation-search.component.html',
  styleUrls: ['./situation-search.component.scss'],
  providers: [DatePipe],
})
export class SituationSearchComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  datePipe = inject(DatePipe);
  encrypt = inject(EncryptionService);
  router = inject(Router);
  dialog = inject(MatDialog);
  investigationService = inject(InvestigationService);
  penaltyStatus = inject(LookupService).lookups.penaltyStatus;
  lang = inject(LangService);
  situationSearchService = inject(SituationSearchService);
  fb = inject(FormBuilder);
  locationStrategy = inject(LocationStrategy);

  id: number = this.data && (this.data.id as number);
  type: number = this.data && (this.data.type as number);
  isCompany: boolean = this.data && (this.data.isCompany as boolean);
  offender: Offender = this.data && (this.data.offender as Offender);

  situations!: SituationSearch[];
  filteredSituations!: SituationSearch[];
  today = new Date();
  employee!: MawaredEmployee;
  clearingAgent!: ClearingAgent;
  clearingAgency!: ClearingAgency;
  viewDecisionFile$ = new Subject<string>();
  statusFilter = new UntypedFormControl(null, []);
  dateRangeFormGroup!: FormGroup;

  protected readonly MawaredEmployee = MawaredEmployee;
  protected readonly CaseTypes = CaseTypes;
  protected config = Config;

  mapSituations = new Map<string, Map<number, SituationSearch[]>>();

  ngOnInit(): void {
    this.loadSituation();
    this.listenToViewDecisionFile();
    this.listenToStatusFilterChange();
    this.buildDateFilterForm();
    this.listenToDateFilterChange();
    if (this.type === OffenderTypes.EMPLOYEE) {
      this.employee = this.offender as unknown as MawaredEmployee;
    } else if (this.type === OffenderTypes.BROKER && !this.isCompany) {
      this.clearingAgent = this.offender as unknown as ClearingAgent;
    } else {
      this.clearingAgency = this.offender as unknown as ClearingAgency;
    }
  }

  buildDateFilterForm() {
    this.dateRangeFormGroup = this.fb.group({
      start: [null],
      end: [null],
    });
  }

  private loadSituation() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.situationSearchService
            .loadSituation(this.id, this.type, this.isCompany)
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe((data: SituationSearch[]) => {
        this.situations = data;
        this.filteredSituations = data;
        this.createMapSituations(data);
      });
  }

  createMapSituations(situations: SituationSearch[]) {
    this.mapSituations.clear();
    situations.forEach(situation => {
      const caseId = situation.caseId;
      const violationTypeId = situation.violationTypeId;

      const hasCaseId = this.mapSituations.has(caseId);
      if (hasCaseId) {
        const hasViolationType = this.mapSituations
          .get(caseId)!
          .has(violationTypeId);
        if (hasViolationType) {
          this.mapSituations.get(caseId)!.get(violationTypeId)!.push(situation);
        } else {
          this.mapSituations.get(caseId)!.set(violationTypeId, [situation]);
        }
      } else {
        const innerMap = new Map<number, SituationSearch[]>();
        innerMap.set(violationTypeId, [situation]);
        this.mapSituations.set(caseId, innerMap);
      }
    });
  }

  getViolationDateString(situation: SituationSearch): string {
    if (
      !!situation.violationInfo.violationsDateFrom &&
      !!situation.violationInfo.violationsDateTo
    ) {
      return (
        this.datePipe.transform(
          new Date(situation.violationInfo.violationsDateFrom),
          'dd/MM/yyyy',
        ) +
        ' - ' +
        this.datePipe.transform(
          new Date(situation.violationInfo.violationsDateTo),
          'dd/MM/yyyy',
        )
      );
    }
    return this.datePipe.transform(
      new Date(situation.violationInfo.violationsDate),
      'dd/MM/yyyy',
    )!;
  }

  view(caseId: string) {
    const itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: OpenFrom.DRAFT_SCREEN,
      taskId: caseId,
      caseId: caseId,
      caseType: CaseTypes.INVESTIGATION,
    });

    const urlTree = this.router.createUrlTree([AppFullRoutes.INVESTIGATION], {
      queryParams: { item: itemDetails },
    });

    const fullUrl = this.locationStrategy.prepareExternalUrl(
      this.router.serializeUrl(urlTree),
    );

    window.open(fullUrl, '_blank');
  }

  getDecisionDateString(situation: SituationSearch) {
    return this.datePipe.transform(
      new Date(situation.offenderInfo.penaltyAppliedDate),
      'dd/MM/yyyy',
    );
  }

  private listenToViewDecisionFile() {
    this.viewDecisionFile$
      .pipe(
        switchMap(vsId => {
          return this.investigationService.getDecisionFileAttachments(vsId);
        }),
      )
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(ViewAttachmentPopupComponent, {
              width: '100vw',
              height: '100vh',
              maxWidth: '100vw',
              maxHeight: '100vh',
              hasBackdrop: true,
              disableClose: true,
              data: {
                model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  private listenToStatusFilterChange() {
    this.statusFilter.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private listenToDateFilterChange() {
    this.dateRangeFormGroup.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.applyFilters();
      });
  }

  private applyFilters() {
    const statusValue = this.statusFilter.value;
    const dateRangeValue = this.dateRangeFormGroup.value;

    let filtered = this.situations;

    if (statusValue !== null && statusValue !== undefined) {
      filtered = filtered.filter(
        situation => situation.offenderInfo.penaltyStatus === statusValue,
      );
    }

    if (dateRangeValue && dateRangeValue.start && dateRangeValue.end) {
      filtered = this.filterSituationsByDate(
        dateRangeValue.start,
        dateRangeValue.end,
        filtered,
      );
    }

    this.filteredSituations = filtered;
    this.createMapSituations(filtered);
  }

  private filterSituationsByDate(
    start: Date,
    end: Date,
    situations: SituationSearch[],
  ): SituationSearch[] {
    return situations.filter(situation => {
      const violationDateFrom = new Date(
        situation.violationInfo.violationsDateFrom,
      );
      const violationDateTo = new Date(
        situation.violationInfo.violationsDateTo,
      );
      const violationDate = new Date(situation.violationInfo.violationsDate);

      return (
        (violationDateFrom >= start && violationDateFrom <= end) ||
        (violationDateTo >= start && violationDateTo <= end) ||
        (violationDate >= start && violationDate <= end)
      );
    });
  }

  getFirstSituation(
    violationMap: Map<number, SituationSearch[]>,
  ): SituationSearch {
    const firstKey = Array.from(violationMap.keys())[0];
    const situations = violationMap.get(firstKey)!;
    return situations[0];
  }

  resetDateRange(event: MouseEvent) {
    event.stopPropagation();
    this.dateRangeFormGroup.reset();
  }
}
