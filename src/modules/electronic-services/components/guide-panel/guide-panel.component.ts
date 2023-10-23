import { Component, OnInit, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OffenderTypes } from '@enums/offender-types';
import { OperationType } from '@enums/operation-type';
import { PenaltySignerTypes } from '@enums/penalty-signer-types';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { GuidePanel } from '@models/guide-panel';
import { Lookup } from '@models/lookup';
import { NoneFilterColumn } from '@models/none-filter-column';
import { Penalty } from '@models/penalty';
import { ViolationType } from '@models/violation-type';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { DialogService } from '@services/dialog.service';
import { GuidePanelService } from '@services/guide-panel.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { ViolationTypeService } from '@services/violation-type.service';
import { ignoreErrors } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import { Observable, ReplaySubject, Subject, catchError, exhaustMap, filter, isObservable, of, switchMap, takeUntil, throwError } from 'rxjs';

@Component({
  selector: 'app-guide-panel',
  templateUrl: './guide-panel.component.html',
  styleUrls: ['./guide-panel.component.scss'],
})
export class GuidePanelComponent extends OnDestroyMixin(class {}) implements OnInit {
  guidePanelService = inject(GuidePanelService);
  lookupService = inject(LookupService);
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  dialog = inject(DialogService);
  violationTypeService = inject(ViolationTypeService);

  offenderTypes: Lookup[] = this.lookupService.lookups.offenderType;
  offenderLevels: Lookup[] = this.lookupService.lookups.offenderLevel;
  penaltySigners: Lookup[] = this.lookupService.lookups.penaltySigner;
  filteredPenaltySigners: Lookup[] = [];
  violationTypes!: ViolationType[];

  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Penalty>();
  selectedTab = 0;

  ngOnInit(): void {
    this.getViolationTypes();
    this.form = this.fb.group(new GuidePanel().buildForm());
    this.onOffenderTypeChange();
    this.listenToSearch();
  }

  actions: ContextMenuActionContract<Penalty>[] = [
    {
      name: 'more-details',
      type: 'action',
      label: 'more_details',
      icon: AppIcons.INFORMATION,
      callback: item => {
        this.viewRecord(item);
      },
    },
  ];

  columnsWrapper: ColumnsWrapper<Penalty> = new ColumnsWrapper(
    new NoneFilterColumn('violationType'),
    new NoneFilterColumn('repeat'),
    new NoneFilterColumn('penGuidance'),
    new NoneFilterColumn('arName'),
    new NoneFilterColumn('enName'),
    new NoneFilterColumn('penaltyWeight'),
    new NoneFilterColumn('erasureDuration'),
    new NoneFilterColumn('isCash'),
    new NoneFilterColumn('cashAmount'),
    new NoneFilterColumn('isDeduction'),
    new NoneFilterColumn('deductionDays'),
    new NoneFilterColumn('status'),
    new NoneFilterColumn('actions')
  );

  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  get offenderTypeField() {
    return this.form.get('offenderType');
  }

  get offenderLevelField() {
    return this.form.get('offenderLevel');
  }

  resetForm() {
    this.form.reset();
  }

  protected getViolationTypes() {
    this.violationTypeService.loadAsLookups().subscribe(data => {
      this.violationTypes = data;
    });
  }

  isEmployee() {
    return this.offenderTypeField?.value === OffenderTypes.EMPLOYEE;
  }

  onOffenderTypeChange() {
    this.offenderTypeField?.valueChanges.subscribe(value => {
      if (value === OffenderTypes.EMPLOYEE) {
        this.offenderLevelField?.setValidators(CustomValidators.required);
        this.filteredPenaltySigners = this.penaltySigners.filter(
          penaltySigner => penaltySigner.lookupKey !== PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
        );
      } else {
        this.offenderLevelField?.setValue(null);
        this.offenderLevelField?.setValidators(null);
        this.filteredPenaltySigners = this.penaltySigners.filter(
          penaltySigner => penaltySigner.lookupKey === PenaltySignerTypes.PRESIDENT_ASSISTANT_FOR_CUSTOMS_AFFAIRS_OR_COMMISSIONER
        );
      }
      this.offenderLevelField?.updateValueAndValidity();
    });
  }

  private listenToSearch() {
    this.search$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => {
          const result = this._beforeSearch();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(filter(value => value))
      .pipe(
        exhaustMap(() => {
          return this.guidePanelService.loadSearchResult(this.formValidValues()).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe((data: Penalty[]) => {
        if (data.length) {
          this.selectedTab = 1;
        }
        data = data.sort((penalty1, penalty2) => {
          if (penalty1.penGuidance === null || penalty2.penGuidance === null) {
            return +(penalty1.penGuidance === null) - +(penalty2.penGuidance === null);
          }
          return penalty1.penGuidance - penalty2.penGuidance;
        });
        this.displayedList = new MatTableDataSource(data);
      });
  }

  formValidValues() {
    let values = this.form.value;

    if (values.offenderLevel === null) {
      delete values.offenderLevel;
    }
    if (values.repeat === null) {
      delete values.repeat;
    }
    return values;
  }

  getBooleanString(bool: boolean) {
    return this.lang.getTranslate(bool ? 'yes' : 'no');
  }

  viewRecord(model: Penalty): MatDialogRef<PenaltyPopupComponent, UserClick.CLOSE> {
    return this.dialog.open<PenaltyPopupComponent, CrudDialogDataContract<Penalty>, UserClick.CLOSE>(PenaltyPopupComponent, {
      data: {
        model,
        operation: OperationType.VIEW,
      },
    });
  }

  hasFilteredPenaltySigners() {
    return this.filteredPenaltySigners.length;
  }
}