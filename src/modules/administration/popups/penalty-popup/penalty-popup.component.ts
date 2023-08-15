import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Penalty } from '@models/penalty';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { LookupService } from '@services/lookup.service';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';
import { CustomValidators } from '@validators/custom-validators';
import { PenaltyDetails } from '@models/penalty-details';

@Component({
  selector: 'app-penalty-popup',
  templateUrl: './penalty-popup.component.html',
  styleUrls: ['./penalty-popup.component.scss'],
})
export class PenaltyPopupComponent extends AdminDialogComponent<Penalty> {
  lookupService = inject(LookupService);

  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Penalty> = inject(MAT_DIALOG_DATA);

  offenderTypes: Lookup[] = this.lookupService.lookups.offenderType;

  statusTooltipText = this.model?.status === StatusTypes.ACTIVE ? this.lang.map.active : this.lang.map.in_active;

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
    this.listenToStatusChange();
    this.listenToIsCash();
    this.listenToIsDeduction();
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): Penalty | Observable<Penalty> {
    return new Penalty().clone<Penalty>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: Penalty): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  protected listenToStatusChange() {
    this.status?.valueChanges.subscribe(value => {
      this.statusTooltipText = value ? this.lang.map.active : this.lang.map.in_active;
    });
  }

  listenToIsCash() {
    this.form.get('isCash')?.valueChanges.subscribe(value => {
      value
        ? this.cashAmountField?.addValidators([CustomValidators.required, CustomValidators.number, Validators.min(500), Validators.max(5000)])
        : this.cashAmountField?.clearValidators();
      this.cashAmountField?.updateValueAndValidity();
    });
  }

  listenToIsDeduction() {
    this.form.get('isDeduction')?.valueChanges.subscribe(value => {
      value
        ? this.deductionDaysField?.addValidators([CustomValidators.required, CustomValidators.number, Validators.min(1), Validators.max(15)])
        : this.deductionDaysField?.clearValidators();
      this.deductionDaysField?.updateValueAndValidity();
    });
  }

  get cashAmountField() {
    return this.form.get('cashAmount');
  }
  get deductionDaysField() {
    return this.form.get('deductionDays');
  }
  get status() {
    return this.form.get('status');
  }
  get isDeductionTrue() {
    return this.form.get('isDeduction')?.value === 1;
  }
  get isCashTrue() {
    return this.form.get('isCash')?.value === 1;
  }
  get penaltyDetails() {
    return this.model.detailsList as unknown as PenaltyDetails[];
  }
}
