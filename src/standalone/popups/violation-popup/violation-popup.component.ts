import {
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  InputSignal,
} from '@angular/core';

import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { ViolationType } from '@models/violation-type';
import { ViolationClassification } from '@models/violation-classification';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { Violation } from '@models/violation';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { InputComponent } from '@standalone/components/input/input.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { range } from '@utils/utils';
import { ConfigService } from '@services/config.service';
import { LookupService } from '@services/lookup.service';
import { ClassificationTypes } from '@enums/violation-classification';
import { CustomValidators } from '@validators/custom-validators';
import { OperationType } from '@enums/operation-type';
import { Router } from '@angular/router';
import { DialogService } from '@services/dialog.service';
import { DatePipe } from '@angular/common';
import { ReportType } from '@app-types/validation-return-type';
import { Investigation } from '@models/investigation';

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
    DatePipe,
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
  types: ViolationType[] = [];
  classifications: ViolationClassification[] = [];
  todayDate: Date = new Date();
  maxEndDate: Date | undefined;
  minEndDate: Date | undefined;
  controls = {
    classification: () => this.form.get('violationClassificationId'),
    violationType: () => this.form.get('violationTypeId'),
    violationsDateFrom: () => this.form.get('violationsDateFrom'),
    violationsDateTo: () => this.form.get('violationsDateTo'),
    violationsDate: () => this.form.get('violationsDate'),
    customsDeclarationNumber: () => this.form.get('customsDeclarationNumber'),
  };

  config = inject(ConfigService);

  years: string[] = range(
    new Date().getFullYear() - this.config.CONFIG.YEAR_RANGE_FROM_CURRENT_YEAR,
    new Date().getFullYear(),
  ).map(i => i.toString());

  classificationsMap: Record<number, ViolationClassification> = {} as Record<
    number,
    ViolationClassification
  >;
  typesMap: Record<number, ViolationType> = {} as Record<number, ViolationType>;

  isCriminal = false;
  isCustoms = false;
  isAbsenceType = false;
  onlyOneDay = false;
  securityManagement = this.lookupService.lookups.securityManagement;

  reportType = computed(() => {
    return this.data.extras?.reportType
      ? (
          this.data.extras as { reportType: InputSignal<ReportType> }
        ).reportType()
      : 'None';
  });
  caseModel = computed(() => {
    return (this.data.extras as { model: InputSignal<Investigation> }).model();
  });
  caseId = computed(() => {
    return this.caseModel().id;
  });

  askForSaveModel = (
    this.data.extras as { askForSaveModel: EventEmitter<void> }
  ).askForSaveModel;

  effect = effect(() => {
    if (this.caseId()) {
      this.waitTillPendingSaveDone$.next();
    }
  });
  private waitTillPendingSaveDone$: Subject<void> = new Subject<void>();

  protected override _init() {
    super._init();
    this.loadClassifications();
    if (
      this.operation === OperationType.UPDATE ||
      this.operation === OperationType.VIEW
    ) {
      this.data.extras
        ? (() => {
            this.types = this.data.extras.types as ViolationType[];
          })()
        : null;
    }
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm() {
    super._afterBuildForm();
    // listen to some changes from specific properties
    this.listenToClassificationChange();
    this.listenToViolationTypeChange();

    if (
      this.operation === OperationType.UPDATE ||
      this.operation === OperationType.VIEW
    ) {
      this.data.extras &&
        this.controls
          .classification()
          ?.patchValue(this.data.extras.classificationId, { emitEvent: false });
      this.controls.classification()?.disable({ emitEvent: false });
      this.checkClassification();
      this.checkViolationType();
      this.checkRequiredField();
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    if (this.form.invalid) {
      this.dialog.error(
        this.lang.map.msg_make_sure_all_required_fields_are_filled,
      );
      this.form.markAllAsTouched();
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
    this.caseModel().violationInfo = [...this.caseModel().violationInfo, model];
    this.dialogRef.close(model);
  }

  private prepareClassificationMap() {
    this.classificationsMap = this.classifications.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
  }

  private prepareTypeMap() {
    this.typesMap = this.types.reduce((acc, item) => {
      return { ...acc, [item.id]: item };
    }, {});
  }

  private listenToClassificationChange() {
    this.controls
      .classification()
      ?.valueChanges.pipe(
        tap(() => this.checkClassification()),
        switchMap(value =>
          this.violationTypeService.load(undefined, {
            classificationId: value,
          }),
        ),
      )
      .pipe(map(pagination => pagination.rs))
      .subscribe(value => {
        this.controls.violationType()?.setValue(null);
        this.types = value;
        this.prepareTypeMap();
      });
  }

  private listenToViolationTypeChange() {
    this.controls.violationType()?.valueChanges.subscribe(() => {
      this.checkViolationType();
      this.checkRequiredField();
    });
  }

  private checkClassification(): void {
    this.isCriminal =
      this.controls.classification()?.value === ClassificationTypes.criminal;
    this.isCustoms =
      this.controls.classification()?.value === ClassificationTypes.custom;
  }

  // private checkClassification(): void {
  //   const selectedClassification = this.classifications.find(
  //       classification =>
  //           classification.id === this.controls.classification()?.value,
  //   );
  //   this.isCriminal =
  //       selectedClassification?.key === ClassificationTypes.criminal;
  //   this.isCustoms = selectedClassification?.key === ClassificationTypes.custom;
  // }
  onSelectionChange(): void {
    if (
      this.controls.violationsDateFrom()?.value &&
      !this.controls.violationsDateTo()?.value
    ) {
      const selectedType = this.typesMap[this.controls.violationType()?.value];
      const maxDate = new Date(this.controls.violationsDateFrom()?.value);
      const minDate = new Date(this.controls.violationsDateFrom()?.value);
      maxDate.setDate(maxDate.getDate() + selectedType.numericTo - 1);
      minDate.setDate(minDate.getDate() + selectedType.numericFrom - 1);

      this.maxEndDate = maxDate;
      this.minEndDate = minDate;
    } else {
      this.maxEndDate = undefined;
      this.minEndDate = undefined;
    }
  }

  private checkViolationType(): void {
    const selectedType = this.typesMap[this.controls.violationType()?.value];
    this.isAbsenceType = selectedType && selectedType.isAbsence;
    this.onlyOneDay =
      selectedType &&
      selectedType.numericFrom === 1 &&
      selectedType.numericTo - selectedType.numericFrom === 1;
  }

  private checkRequiredField(): void {
    this.isAbsenceType && !this.onlyOneDay
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

    this.isCustoms
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
    this.minEndDate = undefined;
    this.maxEndDate = undefined;
    this.form.updateValueAndValidity();
  }

  private loadClassifications(): void {
    this.violationClassificationService.loadAsLookups().subscribe(list => {
      this.classifications = list.filter(
        vc =>
          this.reportType() === 'None' ||
          (this.reportType() === 'Creminal' &&
            vc.id === ClassificationTypes.criminal) ||
          (this.reportType() === 'Normal' &&
            vc.id !== ClassificationTypes.criminal),
      );
      this.prepareClassificationMap();
    });
  }
}
