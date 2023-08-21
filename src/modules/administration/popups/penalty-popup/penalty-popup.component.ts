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
  penaltyDetailsList!: PenaltyDetails[];
  tempList!: PenaltyDetails[];
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Penalty> = inject(MAT_DIALOG_DATA);
  penaltyDetailsListIsEmpty = false;

  offenderTypes: Lookup[] = this.lookupService.lookups.offenderType;

  statusTooltipText = this.model?.status === StatusTypes.ACTIVE ? this.lang.map.active : this.lang.map.in_active;
  activeTab = 0;

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm(): void {
    super._afterBuildForm();
    this.penaltyDetailsList = this.penaltyDetails ?? [];
    this.tempList = this.penaltyDetailsList.map(detail => new PenaltyDetails().clone<PenaltyDetails>(detail));
    this.listenToStatusChange();
    this.listenToIsCash();
    this.listenToIsDeduction();

    this.dialogRef.afterClosed().subscribe(() => {
      this.model.detailsList = this.tempList.slice();
    });
  }

  checkDetailsListValidity(listIsEmpty: boolean) {
    this.penaltyDetailsListIsEmpty = listIsEmpty;
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();

    if (!this.penaltyDetailsList.length) {
      this.activeTab = 1;
      this.penaltyDetailsListIsEmpty = true;
    }
    if (!this.form.valid) this.activeTab = 0;

    return this.form.valid && !this.penaltyDetailsListIsEmpty;
  }

  protected _prepareModel(): Penalty | Observable<Penalty> {
    return new Penalty().clone<Penalty>({
      ...this.model,
      ...this.form.value,
      cashAmount: this.isCashTrue ? this.cashAmountField?.value : null,
      deductionDays: this.isDeductionTrue ? this.deductionDaysField?.value : null,
      detailsList: this.penaltyDetailsList,
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
      if (value) {
        this.cashAmountField?.addValidators([CustomValidators.required, CustomValidators.number, Validators.min(500), Validators.max(5000)]);
        this.form.get('isDeduction')?.setValue(false, { emitEvent: false });
        this.deductionDaysField?.clearValidators();
        this.deductionDaysField?.updateValueAndValidity();
      } else {
        this.cashAmountField?.clearValidators();
      }
      this.cashAmountField?.updateValueAndValidity();
    });
  }

  listenToIsDeduction() {
    this.form.get('isDeduction')?.valueChanges.subscribe(value => {
      if (value) {
        this.deductionDaysField?.addValidators([CustomValidators.required, CustomValidators.number, Validators.min(1), Validators.max(15)]);
        this.form.get('isCash')?.setValue(false, { emitEvent: false });
        this.cashAmountField?.clearValidators();
        this.cashAmountField?.updateValueAndValidity();
      } else {
        this.deductionDaysField?.clearValidators();
      }
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
    return this.form.get('isDeduction')?.value;
  }
  get isCashTrue() {
    return this.form.get('isCash')?.value;
  }
  get penaltyDetails() {
    return this.model.detailsList;
  }
}
