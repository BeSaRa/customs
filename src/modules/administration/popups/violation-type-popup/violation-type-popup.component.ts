import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationType } from '@models/violation-type';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { ViolationClassification } from '@models/violation-classification';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { OffenderTypes } from '@enums/offender-types';
import { CustomValidators } from '@validators/custom-validators';

@Component({
  selector: 'app-violation-type-popup',
  templateUrl: './violation-type-popup.component.html',
  styleUrls: ['./violation-type-popup.component.scss'],
})
export class ViolationTypePopupComponent extends AdminDialogComponent<ViolationType> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ViolationType> = inject(MAT_DIALOG_DATA);
  lookupService = inject(LookupService);
  violationClassifications!: ViolationClassification[];
  violationClassificationService = inject(ViolationClassificationService);
  offenderTypes: Lookup[] = this.lookupService.lookups.offenderType;
  criminalTypes: Lookup[] = this.lookupService.lookups.criminalType;
  responsibilityRepeatViolations: Lookup[] = this.lookupService.lookups.responsibilityRepeatViolations;
  violationLevels: Lookup[] = this.lookupService.lookups.violationLevel;
  managerDecisions: Lookup[] = this.lookupService.lookups.managerDecisionControl;

  protected override _initPopup(): void {
    super._initPopup();
    this.loadViolationClassifications();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    this.onOffenderTypeChange();
    this.onViolationClassificationChange();
    this.onIsNumericChange();
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): ViolationType | Observable<ViolationType> {
    return new ViolationType().clone<ViolationType>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: ViolationType): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    this.dialogRef.close(this.model);
  }

  protected loadViolationClassifications() {
    this.violationClassificationService.loadAsLookups().subscribe(data => {
      this.violationClassifications = data;
    });
  }

  isNumeric(): boolean {
    return !!this.form.get('isNumeric')?.value;
  }
  get classificationId() {
    return this.form.get('classificationId');
  }
  get offenderType() {
    return this.form.get('offenderType');
  }
  get responsibilityRepeatViolation() {
    return this.form.get('responsibilityRepeatViolations');
  }
  get criminalType() {
    return this.form.get('criminalType');
  }
  get numericFrom() {
    return this.form.get('numericFrom');
  }
  get numericTo() {
    return this.form.get('numericTo');
  }

  isCriminal(): boolean {
    if (this.violationClassifications === undefined) return false;
    let isCriminal = false;
    this.violationClassifications.forEach(classification => {
      if (classification.id === this.classificationId?.value && classification.key === 'criminal') isCriminal = true;
    });
    return isCriminal;
  }
  isBroker(): boolean {
    let isBroker = false;
    if (this.offenderType?.value === OffenderTypes.BROKER) isBroker = true;
    return isBroker;
  }
  onOffenderTypeChange() {
    this.offenderType?.valueChanges.subscribe(() => {
      if (this.offenderType?.value === OffenderTypes.EMPLOYEE) {
        this.responsibilityRepeatViolation?.setValue(null);
        this.responsibilityRepeatViolation?.setErrors(null);
        this.responsibilityRepeatViolation?.clearValidators();
      } else {
        this.responsibilityRepeatViolation?.setValidators(CustomValidators.required);
      }
    });
  }
  onViolationClassificationChange() {
    this.classificationId?.valueChanges.subscribe(() => {
      if (!this.isCriminal()) {
        this.criminalType?.setValue(null);
        this.criminalType?.setErrors(null);
        this.criminalType?.clearValidators();
      } else {
        this.criminalType?.setValidators(CustomValidators.required);
      }
    });
  }
  onIsNumericChange() {
    this.form.get('isNumeric')?.valueChanges.subscribe(() => {
      if (!this.isNumeric()) {
        this.numericFrom?.setValue(null);
        this.numericTo?.setValue(null);
        this.numericFrom?.setErrors(null);
        this.numericTo?.setErrors(null);
        this.numericFrom?.clearValidators();
        this.numericTo?.clearValidators();
      } else {
        this.numericFrom?.setValidators(CustomValidators.required);
        this.numericTo?.setValidators(CustomValidators.required);
      }
    });
  }
}
