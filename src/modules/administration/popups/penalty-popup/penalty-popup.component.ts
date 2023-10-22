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
import { OffenderTypes } from '@enums/offender-types';

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
  isEmployee: boolean = false;

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
    this.listenToOffenderTypeChange();
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
      cashAmount: this.isCash?.value ? this.cashAmount?.value : null,
      deductionDays: this.isDeduction?.value ? this.deductionDays?.value : null,
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
        this.cashAmount?.addValidators([CustomValidators.required, CustomValidators.number, Validators.min(500), Validators.max(5000)]);
        this.form.get('isDeduction')?.setValue(false, { emitEvent: false });
        this.deductionDays?.setValue(null);
        this.deductionDays?.clearValidators();
        this.deductionDays?.updateValueAndValidity();
      } else {
        this.cashAmount?.setValue(null);
        this.cashAmount?.clearValidators();
      }
      this.cashAmount?.updateValueAndValidity();
    });
  }

  listenToIsDeduction() {
    this.form.get('isDeduction')?.valueChanges.subscribe(value => {
      if (value) {
        this.deductionDays?.addValidators([CustomValidators.required, CustomValidators.number, Validators.min(1), Validators.max(15)]);
        this.form.get('isCash')?.setValue(false, { emitEvent: false });
        this.cashAmount?.setValue(null);
        this.cashAmount?.clearValidators();
        this.cashAmount?.updateValueAndValidity();
      } else {
        this.deductionDays?.setValue(null);
        this.deductionDays?.clearValidators();
      }
      this.deductionDays?.updateValueAndValidity();
    });
  }

  listenToOffenderTypeChange() {
    this.form.get('offenderType')?.valueChanges.subscribe(value => {
      this.deductionDays?.setValue(null);
      this.cashAmount?.setValue(null);
      this.isDeduction?.setValue(false);
      this.isCash?.setValue(false);
      this.isEmployee = value === OffenderTypes.EMPLOYEE;
    });
  }
  get cashAmount() {
    return this.form.get('cashAmount');
  }
  get deductionDays() {
    return this.form.get('deductionDays');
  }
  get status() {
    return this.form.get('status');
  }
  get isDeduction() {
    return this.form.get('isDeduction');
  }
  get isCash() {
    return this.form.get('isCash');
  }
  get penaltyDetails() {
    return this.model.detailsList;
  }
}
