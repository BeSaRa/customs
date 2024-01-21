import { Investigation } from '@models/investigation';
import { Component, inject } from '@angular/core';

import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { map, Observable, Subject, switchMap, tap, filter } from 'rxjs';
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
import { TransformerAction } from '@contracts/transformer-action';
import { DialogService } from '@services/dialog.service';

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

  securityManagement = this.lookupService.lookups.securityManagement;

  transformer$ =
    this.data.extras &&
    (this.data.extras.transformer$ as Subject<
      TransformerAction<Investigation>
    >);

  caseId = this.data.extras && (this.data.extras.caseId as string);

  protected override _init() {
    super._init();
    this.loadClassifications();
    if (
      this.operation === OperationType.UPDATE ||
      this.operation === OperationType.VIEW
    ) {
      this.data.extras
        ? (() => {
            this.classifications = this.data.extras
              .classifciations as ViolationClassification[];
            this.types = this.data.extras.types as ViolationType[];
          })()
        : null;
    }
    if (!this.caseId) this.listenToSaveCaseDone();
  }

  listenToSaveCaseDone() {
    this.transformer$
      ?.pipe(
        filter(
          (data: TransformerAction<Investigation>) => data.action === 'done',
        ),
      )
      .subscribe((data: TransformerAction<Investigation>) => {
        this.caseId = data.model?.id;
        this.save$.next();
      });
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
      this.checkClassification();
      this.checkViolationType();
      this.checkRequiredField();
    }
  }

  addViolation() {
    if (this._beforeSave()) {
      if (!this.caseId) {
        this.transformer$?.next({ action: 'save' });
      } else {
        this.save$.next();
      }
    }
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    if (this.form.invalid) {
      this.dialog.error(
        this.lang.map.msg_make_sure_all_required_fields_are_filled,
      );
      this.form.markAllAsTouched();
    }
    return this.form.valid;
  }

  protected _prepareModel(): Violation | Observable<Violation> {
    return new Violation().clone({
      ...this.model,
      ...this.form.getRawValue(),
      caseId: this.caseId,
      status: 1,
    });
  }

  protected _afterSave(model: Violation): void {
    this.model = model;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.lang.map.violations }),
    );
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

  private checkViolationType(): void {
    const selectedType = this.typesMap[this.controls.violationType()?.value];
    this.isAbsenceType = selectedType && selectedType.isAbsence;
  }

  private checkRequiredField(): void {
    this.isAbsenceType
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
    this.form.updateValueAndValidity();
  }

  private loadClassifications(): void {
    this.violationClassificationService.loadAsLookups().subscribe(list => {
      this.classifications = list;
      this.prepareClassificationMap();
    });
  }
}
