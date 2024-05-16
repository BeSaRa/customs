import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ManagerDelegation } from '@models/manager-delegation';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { Penalty } from '@models/penalty';
import { PenaltyService } from '@services/penalty.service';
import { InternalUser } from '@models/internal-user';
import { InternalUserService } from '@services/internal-user.service';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { MawaredDepartment } from '@models/mawared-department';

@Component({
  selector: 'app-manager-delegation-popup',
  templateUrl: './manager-delegation-popup.component.html',
  styleUrls: ['./manager-delegation-popup.component.scss'],
})
export class ManagerDelegationPopupComponent extends AdminDialogComponent<ManagerDelegation> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ManagerDelegation> = inject(MAT_DIALOG_DATA);
  penalties!: Penalty[];
  penaltyService = inject(PenaltyService);

  internalUsers!: InternalUser[];
  internalUsersService = inject(InternalUserService);

  departments!: MawaredDepartment[];
  departmentService = inject(MawaredDepartmentService);
  today = new Date();

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  override ngOnInit() {
    super.ngOnInit();
    this.loadPenalties();
    this.loadInternalUsers();
    this.loadDepartment();
    if (!this.inViewMode()) {
      this.form.get('delegatedId')?.setValue(this.data.extras?.delegatedId);
      this.form.get('departmentId')?.setValue(this.data.extras?.departmentId);
      this.form.get('startDate')?.setValue(this.today);
      this.form
        .get('delegatedPenaltiesList')
        ?.setValue(this.data.extras?.penalties);
      this.form.get('delegatedId')?.disable();
      this.form.get('departmentId')?.disable();
    }
    if (this.inEditMode()) {
      this.form.get('startDate')?.setValue(this.data.extras?.startDate);
      this.form.get('endDate')?.setValue(this.data.extras?.endDate);
    }
  }

  loadPenalties() {
    this.penaltyService
      .loadAsLookups()
      .subscribe(penalties => (this.penalties = penalties));
  }

  loadInternalUsers() {
    this.internalUsersService
      .loadAsLookups()
      .subscribe(users => (this.internalUsers = users));
  }

  loadDepartment() {
    this.departmentService
      .loadAsLookups()
      .subscribe(departments => (this.departments = departments));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): ManagerDelegation | Observable<ManagerDelegation> {
    return new ManagerDelegation().clone<ManagerDelegation>({
      ...this.model,
      ...this.form.getRawValue(),
    });
  }

  protected _afterSave(model: ManagerDelegation): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }

  endDateMinDate() {
    return this.form.get('startDate')?.value || this.today;
  }

  endDateMaxDate() {
    const startDateAsDate = new Date(this.form.get('startDate')?.value);
    return new Date(startDateAsDate.getTime() + 30 * 24 * 60 * 60 * 1000);
  }
}
