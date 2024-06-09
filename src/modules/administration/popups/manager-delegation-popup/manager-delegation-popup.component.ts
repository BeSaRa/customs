import { Component, inject, OnInit } from '@angular/core';
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
export class ManagerDelegationPopupComponent
  extends AdminDialogComponent<ManagerDelegation>
  implements OnInit
{
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
    this.loadInitialData();
    this.setupFormControls();
  }

  private loadInitialData() {
    this.loadPenalties();
    this.loadInternalUsers();
    this.loadDepartment();
  }

  private setupFormControls() {
    if (!this.inViewMode()) {
      this.setupFormForCreation();
    }
    if (this.inEditMode()) {
      this.setupFormForEdit();
    }
  }

  private setupFormForCreation() {
    const delegatedId = this.data.extras?.delegatedId;
    const departmentId = this.data.extras?.departmentId;
    console.log(departmentId);
    console.log(this.departments);
    this.form.patchValue({
      delegatedId: delegatedId,
      departmentId: departmentId,
      startDate: this.today,
    });

    this.form.get('delegatedId')?.disable();
    this.form.get('departmentId')?.disable();
  }

  private setupFormForEdit() {
    const startDate = this.data.extras?.startDate;
    const endDate = this.data.extras?.endDate;
    const penalties = this.data.extras?.penalties;

    this.form.patchValue({
      startDate: startDate,
      endDate: endDate,
      delegatedPenaltiesList: penalties,
    });
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
}
