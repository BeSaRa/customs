import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ViolationType } from '@models/violation-type';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { ViolationClassification } from '@models/violation-classification';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { OffenderTypes } from '@enums/offender-types';
import { CustomValidators } from '@validators/custom-validators';
import { ViolationLevels } from '@enums/violation-levels';
import { ManagerDecisions } from '@enums/manager-decisions';

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
  filteredOffenderTypes: Lookup[] = this.lookupService.lookups.offenderType;
  criminalTypes: Lookup[] = this.lookupService.lookups.criminalType;
  responsibilityRepeatViolations: Lookup[] =
    this.lookupService.lookups.responsibilityRepeatViolations;
  violationLevels: Lookup[] = this.lookupService.lookups.violationLevel;
  managerDecisions: Lookup[] =
    this.lookupService.lookups.managerDecisionControl;
  filteredManagerDecisions: Lookup[] =
    this.lookupService.lookups.managerDecisionControl;
  activeTab = 0;

  protected override _initPopup(): void {
    super._initPopup();
    this.loadViolationClassifications();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
    this.onViolationClassificationChange();
    this.onIsNumericChange();
    this.onViolationLevelChange();
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
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.activeTab = 1;
  }

  protected loadViolationClassifications() {
    this.violationClassificationService.loadAsLookups().subscribe(data => {
      this.violationClassifications = data;
    });
  }

  get isNumeric() {
    return this.form.get('isNumeric');
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

  get isAbsence() {
    return this.form.get('isAbsence');
  }

  get violationLevel() {
    return this.form.get('level');
  }

  isCriminal(): boolean {
    if (this.violationClassifications === undefined) return false;
    let isCriminal = false;
    this.violationClassifications.forEach(classification => {
      if (
        classification.id === this.classificationId?.value &&
        classification.key === 'criminal'
      )
        isCriminal = true;
    });
    return isCriminal;
  }

  isCustom(): boolean {
    if (this.violationClassifications === undefined) return false;
    let isCustom = false;
    this.violationClassifications.forEach(classification => {
      if (
        classification.id === this.classificationId?.value &&
        classification.key === 'custom'
      )
        isCustom = true;
    });
    return isCustom;
  }

  isClearingAgent(): boolean {
    let isClearingAgent = false;
    if (this.offenderType?.value === OffenderTypes.ClEARING_AGENT)
      isClearingAgent = true;
    return isClearingAgent;
  }

  onViolationClassificationChange() {
    this.classificationId?.valueChanges.subscribe(value => {
      if (!this.isCriminal()) {
        this.criminalType?.setValue(null);
        this.criminalType?.clearValidators();
        this.criminalType?.updateValueAndValidity();
      } else {
        this.criminalType?.setValidators(CustomValidators.required);
      }

      if (!this.isCustom()) {
        this.responsibilityRepeatViolation?.setValue(null);
        this.responsibilityRepeatViolation?.clearValidators();
        this.responsibilityRepeatViolation?.updateValueAndValidity();
      } else {
        this.responsibilityRepeatViolation?.setValidators(
          CustomValidators.required,
        );
      }

      const offenderOfClassification = this.violationClassifications.find(
        vc => vc.id === value,
      )?.offenderType;
      if (offenderOfClassification === OffenderTypes.EMPLOYEE) {
        this.filteredOffenderTypes = this.offenderTypes.filter(
          offenderType => offenderType.lookupKey === OffenderTypes.EMPLOYEE,
        );
      } else if (offenderOfClassification === OffenderTypes.ClEARING_AGENT) {
        this.filteredOffenderTypes = this.offenderTypes.filter(
          offenderType =>
            offenderType.lookupKey === OffenderTypes.ClEARING_AGENT,
        );
      } else {
        this.filteredOffenderTypes = this.offenderTypes;
      }
    });
  }

  onIsNumericChange() {
    this.isNumeric?.valueChanges.subscribe(() => {
      if (!this.isNumeric?.value) {
        this.isAbsence?.setValue(false);
        this.numericFrom?.setValue(null);
        this.numericTo?.setValue(null);
        this.numericFrom?.clearValidators();
        this.numericTo?.clearValidators();
        this.numericFrom?.updateValueAndValidity();
        this.numericTo?.updateValueAndValidity();
      } else {
        this.numericFrom?.setValidators([
          CustomValidators.required,
          Validators.min(0),
        ]);
        this.numericTo?.setValidators([
          CustomValidators.required,
          Validators.min(0),
        ]);
      }
    });
  }

  onViolationLevelChange() {
    this.violationLevel?.valueChanges.subscribe(() => {
      this.filteredManagerDecisions = this.managerDecisions;

      const violationLevel = this.violationLevels.find(
        violationLevel =>
          violationLevel.lookupKey === this.violationLevel?.value,
      )?.lookupKey;

      if (violationLevel === ViolationLevels.SIMPLE) {
        this.filteredManagerDecisions = this.managerDecisions.filter(
          managerDecision =>
            managerDecision.lookupKey ===
              ManagerDecisions.IT_IS_MANDATORY_TO_IMPOSE_A_PENALTY ||
            managerDecision.lookupKey === ManagerDecisions.GUIDANCE,
        );
      } else if (violationLevel === ViolationLevels.SERIOUS) {
        this.filteredManagerDecisions = this.managerDecisions.filter(
          managerDecision =>
            managerDecision.lookupKey ===
              ManagerDecisions.IT_IS_MANDATORY_TO_REQUEST_A_REFERRAL ||
            managerDecision.lookupKey === ManagerDecisions.GUIDANCE,
        );
      } else if (violationLevel === ViolationLevels.VERY_SERIOUS) {
        this.filteredManagerDecisions = this.managerDecisions.filter(
          managerDecision =>
            managerDecision.lookupKey ===
            ManagerDecisions.IT_IS_MANDATORY_TO_REQUEST_A_REFERRAL,
        );
      }
    });
  }
}
