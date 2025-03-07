import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Injector,
  InputSignal,
  signal,
  Signal,
} from '@angular/core';

import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { ReportType } from '@app-types/validation-return-type';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { ClassificationTypes } from '@enums/violation-classification';
import { Investigation } from '@models/investigation';
import { Violation } from '@models/violation';
import { ViolationClassification } from '@models/violation-classification';
import { ViolationType } from '@models/violation-type';
import { ConfigService } from '@services/config.service';
import { DialogService } from '@services/dialog.service';
import { LookupService } from '@services/lookup.service';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ViolationTypeService } from '@services/violation-type.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { range } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import { map, Observable, of, Subject } from 'rxjs';

@Component({
  selector: 'app-violation-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatDialogModule,
    MatIconModule,
    MatTableModule,
    SelectInputComponent,
    InputComponent,
    ControlDirective,
    MatDatepickerModule,
    ReactiveFormsModule,
    TextareaComponent,
    MatTooltip,
    InputSuffixDirective,
  ],

  templateUrl: './violation-popup.component.html',
  styleUrls: ['./violation-popup.component.scss'],
})
export class ViolationPopupComponent extends AdminDialogComponent<Violation> {
  data: CrudDialogDataContract<Violation> = inject(MAT_DIALOG_DATA);
  form!: UntypedFormGroup;
  lookupService = inject(LookupService);
  router = inject(Router);
  dialog = inject(DialogService);
  violationTypeService = inject(ViolationTypeService);
  violationClassificationService = inject(ViolationClassificationService);
  config = inject(ConfigService);
  injector = inject(Injector);
  securityManagement = this.lookupService.lookups.securityManagement;
  classifications: ViolationClassification[] = [];
  _types = signal([] as ViolationType[]);
  violationsList = (this.data.extras?.violationsList || []) as Violation[];
  years: string[] = range(
    new Date().getFullYear() - this.config.CONFIG.YEAR_RANGE_FROM_CURRENT_YEAR,
    new Date().getFullYear(),
  ).map(i => i.toString());
  typesMap = signal({} as Record<number, ViolationType>);
  classificationsMap: Record<number, ViolationClassification> = {};

  todayDate: Date = new Date();
  maxEndDate: Date | undefined;
  minEndDate: Date | undefined;
  controls = {
    classification: () =>
      this.form?.get('violationClassificationId') as UntypedFormControl,
    violationType: () =>
      this.form?.get('violationTypeId') as UntypedFormControl,
    violationsDateFrom: () => this.form.get('violationsDateFrom'),
    violationsDateTo: () => this.form.get('violationsDateTo'),
    violationsDate: () => this.form.get('violationsDate'),
    customsDeclarationNumber: () => this.form.get('customsDeclarationNumber'),
    controlReportNumber: () => this.form.get('controlReportNumber'),
  };

  caseModel = computed(() => {
    return (this.data.extras as { model: InputSignal<Investigation> }).model();
  });
  caseId = computed(() => {
    return this.caseModel().id;
  });
  reportType = computed(() => {
    return this.data.extras?.reportType
      ? (
          this.data.extras as { reportType: InputSignal<ReportType> }
        ).reportType()
      : 'None';
  });

  violationType!: Signal<number>;
  violationClassification!: Signal<number>;

  isCriminal = computed(() => {
    if (this.violationType() || this.typesMap()) {
      const violationType =
        this.typesMap()[this.controls.violationType().value];
      return (
        violationType &&
        violationType.violationClassificationInfo?.key ===
          ClassificationTypes.criminal
      );
    } else if (this.violationClassification() || this.typesMap()) {
      return (
        this.classificationsMap[this.controls.classification().value].key ===
        ClassificationTypes.criminal
      );
    } else return false;
  });
  isCustoms = computed(() => {
    if (this.violationType() || this.typesMap()) {
      const violationType =
        this.typesMap()[this.controls.violationType().value];
      return (
        violationType &&
        violationType.violationClassificationInfo?.key ===
          ClassificationTypes.custom
      );
    } else if (this.violationClassification() || this.typesMap()) {
      return (
        this.classificationsMap[this.controls.classification().value].key ===
        ClassificationTypes.custom
      );
    } else return false;
  });
  isAbsenceType = computed(() => {
    const violationType =
      this.typesMap()[this.violationType()] ||
      this.typesMap()[this.controls.violationType().value];
    return violationType && violationType.isAbsence;
  });
  onlyOneDay = computed(() => {
    const violationType =
      this.typesMap()[this.violationType()] ||
      this.typesMap()[this.controls.violationType().value];
    return violationType && violationType.numericTo <= 1;
  });
  types = computed(() => {
    return this._types().filter(type => {
      return (
        !this.violationClassification() ||
        type.violationClassificationInfo?.key ===
          this.classificationsMap[this.violationClassification()].key
      );
    });
  });

  effect = effect(() => {
    if (this.caseId()) {
      this.waitTillPendingSaveDone$.next();
    }
    if (
      this.violationClassification() &&
      this.typesMap()[this.controls.violationType().value] &&
      this.typesMap()[this.controls.violationType().value]
        .violationClassificationInfo?.key !==
        this.classificationsMap[this.violationClassification()].key
    ) {
      this.controls.violationType().reset({}, { emitEvent: false });
      this.controls
        .violationType()
        .updateValueAndValidity({ emitEvent: false });
    }
    if (this.violationClassification() || this.violationType()) {
      this.checkRequiredField();
    }
  });

  askForSaveModel = (
    this.data.extras as { askForSaveModel: EventEmitter<void> }
  ).askForSaveModel;
  private waitTillPendingSaveDone$: Subject<void> = new Subject<void>();

  protected override _init() {
    super._init();
    this.loadClassifications();
    this.loadViolationTypes();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm() {
    super._afterBuildForm();
    this.violationType = toSignal(this.controls.violationType().valueChanges, {
      injector: this.injector,
    });
    this.violationClassification = toSignal(
      this.controls.classification().valueChanges,
      {
        injector: this.injector,
      },
    );
  }

  alreadyAddedViolation() {
    return this.violationsList.find(v => {
      return (
        v.violationTypeId === this.form.value.violationTypeId &&
        ((v.violationsDate &&
          new Date(v.violationsDate).getTime() ===
            new Date(this.form.value.violationsDate).getTime()) ||
          (this.form.value.violationsDateFrom &&
            this.form.value.violationsDateTo &&
            new Date(this.form.value.violationsDateFrom).getTime() ===
              new Date(v.violationsDateFrom).getTime() &&
            new Date(this.form.value.violationsDateTo).getTime() ===
              new Date(v.violationsDateTo).getTime()))
      );
    });
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    if (this.form.invalid) {
      this.dialog.error(
        this.lang.map.msg_make_sure_all_required_fields_are_filled,
      );
      this.form.markAllAsTouched();
      return of(false);
    }
    if (this.alreadyAddedViolation()) {
      this.dialog.error(
        this.lang.map
          .msg_there_is_already_a_violation_with_same_type_and_date_exist,
      );
      return of(false);
    }
    return !this.caseId()
      ? (() => {
          this.askForSaveModel.emit();
          return this.waitTillPendingSaveDone$.pipe(map(() => true));
        })()
      : of(true);
  }

  protected _prepareModel(): Violation | Observable<Violation> {
    if (this.onlyOneDay()) {
      this.controls
        .violationsDateTo()
        ?.setValue(this.form.getRawValue().violationsDate);
      this.controls
        .violationsDateFrom()
        ?.setValue(this.form.getRawValue().violationsDate);
    }
    return new Violation().clone({
      ...this.model,
      ...this.form.getRawValue(),
      caseId: this.caseId(),
      status: 1,
    });
  }

  protected _afterSave(model: Violation): void {
    this.model = model;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.lang.map.violations }),
    );
    if (this.operation === OperationType.CREATE) {
      this.caseModel().violationInfo = [
        ...this.caseModel().violationInfo,
        model,
      ];
    } else {
      this.caseModel().violationInfo = this.caseModel().violationInfo.map(
        violation => {
          if (violation.id === model.id) {
            return model;
          }
          return violation;
        },
      );
    }
    this.dialogRef.close(model);
  }

  private prepareTypeMap() {
    this.typesMap.set(
      this._types().reduce((acc, item) => {
        return { ...acc, [item.id]: item };
      }, {}),
    );
  }

  private prepareClassificationMap() {
    this.classificationsMap = this.classifications.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
  }

  showDeclarationNumberDetails() {
    this.caseModel()
      .getService()
      .getDeclarationDetails(this.controls.customsDeclarationNumber()?.value)
      .subscribe(({ blob, title, status }) => {
        if (status !== 'success') {
          return this.dialog.error(this.lang.map.declaration_no_does_not_exist);
        }
        return this.dialog.open(ViewAttachmentPopupComponent, {
          disableClose: true,
          data: {
            model: blob,
            title: title,
          },
        });
      });
  }

  showReportNumberDetails() {
    this.caseModel()
      .getService()
      .getOffenceDetails(this.controls.controlReportNumber()?.value)
      .subscribe(({ blob, title, status }) => {
        if (status !== 'success') {
          return this.dialog.error(this.lang.map.offence_no_does_not_exist);
        }
        return this.dialog.open(ViewAttachmentPopupComponent, {
          disableClose: true,
          data: {
            model: blob,
            title: title,
          },
        });
      });
  }

  onSelectionChange(): void {
    if (
      this.controls.violationsDateFrom()?.value &&
      !this.controls.violationsDateTo()?.value
    ) {
      const selectedType =
        this.typesMap()[this.controls.violationType()?.value];
      const maxDate = new Date(this.controls.violationsDateFrom()?.value);
      const minDate = new Date(this.controls.violationsDateFrom()?.value);
      maxDate.setDate(maxDate.getDate() + selectedType.numericTo - 1);
      minDate.setDate(minDate.getDate() + selectedType.numericFrom - 1);

      this.maxEndDate = maxDate > this.todayDate ? this.todayDate : maxDate;
      this.minEndDate = minDate;
    } else if (
      this.controls.violationsDateFrom()?.value &&
      this.controls.violationsDateTo()?.value
    ) {
      this.maxEndDate = new Date();
      this.minEndDate = undefined;
    }
  }

  private checkRequiredField(): void {
    this.isAbsenceType() && !this.onlyOneDay()
      ? (() => {
          this.controls
            .violationsDateFrom()
            ?.setValidators(CustomValidators.required);
          this.controls
            .violationsDateTo()
            ?.setValidators(CustomValidators.required);
          this.controls.violationsDate()?.clearValidators();
        })()
      : (() => {
          this.controls.violationsDateFrom()?.clearValidators();
          this.controls.violationsDateTo()?.clearValidators();
          this.controls
            .violationsDate()
            ?.setValidators(CustomValidators.required);
        })();

    this.isCustoms()
      ? (() => {
          this.controls
            .customsDeclarationNumber()
            ?.setValidators(CustomValidators.required);
        })()
      : (() => {
          this.controls.customsDeclarationNumber()?.clearValidators();
        })();

    this.controls.customsDeclarationNumber()?.reset();
    this.controls.violationsDate()?.reset();
    this.controls.violationsDateFrom()?.reset();
    this.controls.violationsDateTo()?.reset();
    const selectedType = this.typesMap()[this.controls.violationType()?.value];
    const date = new Date();
    selectedType && date.setDate(date.getDate() - selectedType.numericFrom + 1);
    this.maxEndDate = date;
    this.minEndDate = undefined;
    this.form.updateValueAndValidity();
  }

  filterDependingOnReportTypeClassification(classificationKey: string) {
    return (
      this.reportType() === 'None' ||
      (this.reportType() === 'Creminal' &&
        classificationKey === ClassificationTypes.criminal) ||
      (this.reportType() === 'Normal' &&
        classificationKey !== ClassificationTypes.criminal)
    );
  }

  private loadClassifications(): void {
    this.violationClassificationService.loadAsLookups().subscribe(list => {
      this.classifications = list.filter(vc =>
        this.filterDependingOnReportTypeClassification(vc.key),
      );
      this.prepareClassificationMap();
    });
  }

  private loadViolationTypes() {
    return this.violationTypeService.loadAsLookups().subscribe(types => {
      this._types.set(
        types.filter(vt =>
          this.filterDependingOnReportTypeClassification(
            vt.violationClassificationInfo?.key,
          ),
        ),
      );
      this.prepareTypeMap();
      if (this.controls.violationType().value) {
        this.controls
          .classification()
          .setValue(
            this.typesMap()[this.controls.violationType().value]
              .classificationId,
            { emitEvent: false },
          );
      }
      if (this.inEditMode() && this.controls.violationType().value) {
        const selectedType =
          this.typesMap()[this.controls.violationType()?.value];
        const date = new Date();
        date.setDate(date.getDate() - selectedType.numericFrom + 1);
        this.maxEndDate = date;
      }
    });
  }
}
