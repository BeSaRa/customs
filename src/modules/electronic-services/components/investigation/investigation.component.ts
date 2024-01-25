import { DialogService } from '@services/dialog.service';
import { WitnessesListComponent } from '@standalone/components/witnesses-list/witnesses-list.component';
import {
  AfterViewInit,
  Component,
  inject,
  input,
  ViewChild,
} from '@angular/core';
import { LangService } from '@services/lang.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { InvestigationService } from '@services/investigation.service';
import { Investigation } from '@models/investigation';
import { BaseCaseComponent } from '@abstracts/base-case-component';
import { SaveTypes } from '@enums/save-types';
import { OperationType } from '@enums/operation-type';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { filter, map, switchMap, take, takeUntil, tap } from 'rxjs/operators';
import { CaseFolder } from '@models/case-folder';
import { DateAdapter } from '@angular/material/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Violation } from '@models/violation';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { ToastService } from '@services/toast.service';
import { OpenFrom } from '@enums/open-from';
import { INavigatedItem } from '@contracts/inavigated-item';
import { EncryptionService } from '@services/encryption.service';
import { EmployeeService } from '@services/employee.service';
import { LookupService } from '@services/lookup.service';
import { SendTypes } from '@enums/send-types';
import { CommonCaseStatus } from '@enums/common-case-status';
import { Offender } from '@models/offender';
import { OffenderViolation } from '@models/offender-violation';
import { OffenderViolationService } from '@services/offender-violation.service';
import { OpenedInfoContract } from '@contracts/opened-info-contract';
import { SummaryTabComponent } from '@standalone/components/summary-tab/summary-tab.component';
import { ReportType } from '@app-types/validation-return-type';
import { ClassificationTypes } from '@enums/violation-classification';

@Component({
  selector: 'app-investigation',
  templateUrl: './investigation.component.html',
  styleUrls: ['./investigation.component.scss'],
})
export class InvestigationComponent
  extends BaseCaseComponent<Investigation, InvestigationService>
  implements AfterViewInit
{
  ngAfterViewInit(): void {
    Promise.resolve().then(() => {
      this.mandatoryMakePenaltyDecisions =
        this.summaryTabComponent?.offendersViolationsPreview?.mandatoryMakePenaltyDecisions();
    });
  }
  lang = inject(LangService);
  route = inject(ActivatedRoute);
  fb = inject(UntypedFormBuilder);
  dialog = inject(DialogService);
  form!: UntypedFormGroup;
  service = inject(InvestigationService);
  employeeService = inject(EmployeeService);
  router = inject(Router);
  activeRoute = inject(ActivatedRoute);
  toast = inject(ToastService);
  encryptionService = inject(EncryptionService);
  lookupService = inject(LookupService);
  offenderViolationService = inject(OffenderViolationService);
  adapter = inject(DateAdapter);
  info = input<OpenedInfoContract | null>(null);
  canReferralCase: boolean = false;
  @ViewChild(ViolationListComponent)
  violationListComponent!: ViolationListComponent;
  @ViewChild(OffenderListComponent)
  offenderListComponent!: OffenderListComponent;
  @ViewChild(WitnessesListComponent)
  witnessesListComponent!: WitnessesListComponent;
  @ViewChild(SummaryTabComponent)
  summaryTabComponent!: SummaryTabComponent;
  violationDegreeConfidentiality = this.lookupService.lookups.securityLevel;
  mandatoryMakePenaltyDecisions: boolean = false;
  tabsArray = ['basic_info', 'offenders', 'violations', 'external_persons'];
  caseFolders: CaseFolder[] = [];
  caseFoldersMap?: Record<string, CaseFolder>;
  selectedTab = 0;

  violations: Violation[] = [];
  offenders: Offender[] = [];
  reloadOffendersViolations$: BehaviorSubject<null> = new BehaviorSubject(null);
  offendersMappedWIthViolations: Offender[] = [];

  protected override _init() {
    super._init();
    this._listenToLoadOffendersViolations();
  }

  isHrManager() {
    return this.employeeService.isHrManager();
  }

  summaryMode() {
    return !this.isOpenedFromAddScreen();
  }
  isOpenedFromAddScreen() {
    return this.openFrom === OpenFrom.ADD_SCREEN || !this.openFrom;
  }
  canEdit() {
    return (
      this.model?.getCaseStatus() === CommonCaseStatus.NEW ||
      this.model?.getCaseStatus() === CommonCaseStatus.DRAFT ||
      this.model?.getCaseStatus() === CommonCaseStatus.RETURNED
    );
  }

  _buildForm(): void {
    this.form = this.fb.group(
      this.model
        ? this.model.buildForm(true, this.readonly)
        : new Investigation().buildForm(true, this.readonly),
    );
    this.listenToLocationChange();
  }

  canViewExternalPersonsTab() {
    return this.employeeService.hasPermissionTo('VIEW_WITNESS');
  }

  _afterBuildForm(): void {
    this.loadCaseFolders();
  }

  _beforeSave(_saveType: SaveTypes): boolean | Observable<boolean> {
    !this.violations.length &&
      !this.offenders.length &&
      this.dialog.error(
        this.lang.map.add_violation_or_offender_first_to_take_this_action,
      );
    return !!this.violations.length || !!this.offenders.length;
  }

  _prepareModel(): Investigation | Observable<Investigation> {
    return new Investigation().clone<Investigation>({
      ...this.model,
      ...this.form.getRawValue(),
    });
  }

  _afterSave(
    model: Investigation,
    _saveType: SaveTypes,
    _operation: OperationType,
  ): void {
    this.model = model;
    // display success message based on operation and save type

    this.loadCaseFolders();
  }

  _beforeLaunch(): boolean | Observable<boolean> {
    return true;
  }

  _afterLaunch(): void {
    this.resetForm();
    this.toast.success(this.lang.map.request_has_been_sent_successfully);
    this.navigateToSamePageThatUserCameFrom();
  }

  managerLaunch() {
    // TODO: add manager launch logic
  }

  _updateForm(model: Investigation): void {
    this.handleReadOnly();
    if (!model.id) this.resetForm();
    this.model = model;
    this.form.patchValue(model.buildForm(false, this.readonly));
  }

  handleReadOnly() {
    if (!this.model?.id) {
      return;
    }
    // let caseStatus = this.model.getCaseStatus();
    if (this.openFrom === OpenFrom.USER_INBOX) {
      //
    } else if (this.openFrom === OpenFrom.TEAM_INBOX) {
      if (this.model.isClaimed()) {
        this.readonly = false;
      }
    } else if (this.openFrom === OpenFrom.SEARCH) {
      if (this.model?.canCommit()) {
        this.readonly = false;
      }
    }
  }

  getReportType(): ReportType {
    console.log(
      !this.violations.length
        ? 'None'
        : !this.violations.find(v => {
              return (
                v.violationClassificationId === ClassificationTypes.criminal
              );
            })
          ? 'Normal'
          : 'Creminal',
    );
    return !this.violations.length
      ? 'None'
      : !this.violations.find(v => {
            return v.violationClassificationId === ClassificationTypes.criminal;
          })
        ? 'Normal'
        : 'Creminal';
  }
  private _listenToLoadOffendersViolations() {
    this.reloadOffendersViolations$
      .pipe(filter(() => !!this.model?.id))
      .pipe(
        switchMap(() => {
          return this.offenderViolationService.loadComposite(
            {},
            {
              caseId: this.model?.id,
            },
          );
        }),
      )
      .pipe(tap(() => (this.canReferralCase = false)))
      .pipe(
        map(({ rs }) => {
          return rs.reduce((prev: Offender[], curr: OffenderViolation) => {
            const offender = prev.find(
              offender => offender.id === curr.offenderId,
            );
            if (offender) {
              offender.violations.push(curr);
              return [...prev];
            } else {
              return [
                ...prev,
                new Offender().clone<Offender>({
                  ...curr.offenderInfo,
                  violations: [curr],
                }),
              ];
            }
          }, []);
        }),
      )
      .subscribe(data => {
        this.offendersMappedWIthViolations = data;
      });
  }

  saveCase() {
    of(new Investigation().clone<Investigation>(this.form.value))
      .pipe(
        tap(_ => {
          this.form.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            );
        }),
        filter(() => this.form.valid),
        switchMap(model => {
          return model.save();
        }),
      )
      .subscribe((model: Investigation) => {
        this.model = model;
        this._updateForm(model);
        this.updateRoute();
      });
  }

  navigateToSamePageThatUserCameFrom(): void {
    if (this.info === null) {
      return;
    }
    switch (this.info()?.openFrom) {
      case OpenFrom.TEAM_INBOX:
        this.router.navigate(['/home/electronic-services/team-inbox']).then();
        break;
      case OpenFrom.USER_INBOX:
        this.router.navigate(['/home/electronic-services/user-inbox']).then();
        break;
      case OpenFrom.SEARCH:
        this.router
          .navigate(['/home/electronic-services/investigation-search'])
          .then();
        break;
    }
  }

  loadCaseFolders(): void {
    if (!this.model) return;
    // if there is no folders load it
    if (!this.caseFolders.length && this.model.id) {
      this.model
        .getService()
        .loadCaseFolders(this.model.id)
        .pipe(map(folders => (this.caseFolders = folders)))
        .subscribe();
    }
  }

  getCaseFolderIdByName(name: string): string | undefined {
    return this.caseFoldersMap && this.caseFoldersMap[name.toLowerCase()].id;
  }

  launchCase(type: SendTypes) {
    if (!this.model) return;
    this.model.applicantDecision = type;
    this.model
      .save()
      .pipe(
        switchMap(() => {
          return this.launch();
        }),
      )
      .subscribe();
  }

  tabChange($event: number, withParams: boolean = true) {
    const selectedTab = this.tabsArray[$event];
    this.router
      .navigate([], {
        relativeTo: this.activeRoute,
        queryParams: {
          ...(withParams ? this.activeRoute.snapshot.queryParams : undefined),
          tab: selectedTab,
        },
      })
      .then();
  }

  resetForm() {
    this.form.reset();
    this.violationListComponent.resetDataList();
    this.offenderListComponent.resetDataList();
    this.witnessesListComponent.resetDataList();
    this.tabChange(0, false);
  }

  private listenToLocationChange() {
    this.activeRoute.queryParams
      .pipe(takeUntil(this.destroy$))
      .pipe(take(1))
      .pipe(filter(value => !!value['tab']))
      .pipe(map(val => this.tabsArray.indexOf(val['tab'] as string)))
      .subscribe(index => {
        this.selectedTab = index === -1 ? 1 : index;
      });
  }

  updateRoute(): void {
    if (this.model)
      this.router
        .navigate([], {
          relativeTo: this.route,
          queryParams: {
            ...this.route.snapshot.queryParams,
            item: this.encryptionService.encrypt<INavigatedItem>({
              openFrom: OpenFrom.ADD_SCREEN,
              taskId: this.model.id,
              caseId: this.model.id,
              caseType: this.model.caseType,
            }),
          },
        })
        .then();
  }

  createFoldersMap(): void {
    this.caseFoldersMap = this.caseFolders.reduce(
      (acc, item) => {
        return { ...acc, [item.name.toLowerCase()]: item };
      },
      {} as Record<string, CaseFolder>,
    );
  }
}
