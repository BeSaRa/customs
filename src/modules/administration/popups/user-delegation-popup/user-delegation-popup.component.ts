import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { UserDelegationType } from '@enums/user-delegation-type';
import { InternalUser } from '@models/internal-user';
import { OrganizationUnit } from '@models/organization-unit';
import { UserDelegation } from '@models/user-delegation';
import { EmployeeService } from '@services/employee.service';
import { InternalUserService } from '@services/internal-user.service';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { Observable, takeUntil } from 'rxjs';

@Component({
  selector: 'app-user-delegation-popup',
  templateUrl: './user-delegation-popup.component.html',
  styleUrls: ['./user-delegation-popup.component.scss'],
})
export class UserDelegationPopupComponent
  extends AdminDialogComponent<UserDelegation>
  implements OnInit
{
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserDelegation> = inject(MAT_DIALOG_DATA);
  type: UserDelegationType = this.data.extras!.type as UserDelegationType;

  employees: InternalUser[] = [];
  internalUserService = inject(InternalUserService);
  employeeService = inject(EmployeeService);
  departments!: OrganizationUnit[];
  departmentService = inject(OrganizationUnitService);
  today = new Date();

  get departmentId() {
    return this.form.controls['departmentId'];
  }

  get delegatorId() {
    return this.form.controls['delegatorId'];
  }

  get delegateeId() {
    return this.form.controls['delegateeId'];
  }

  override ngOnInit() {
    super.ngOnInit();
    this.listenToDepartmentIdChange();
    this.setUserDepartments();
    this.initValues();
  }

  listenToDepartmentIdChange() {
    if (!this.isFromUserPreferences()) this.delegateeId.disable();
    else this.departmentId.disable();
    this.delegatorId.disable();
    this.departmentId.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(dId => {
        this.delegateeId.reset();
        if (!this.isFromUserPreferences()) this.delegatorId.reset();
        if (dId) {
          this.delegateeId.enable();
          if (!this.isFromUserPreferences()) this.delegatorId.enable();
        } else {
          if (!this.isFromUserPreferences()) this.delegateeId.disable();
          this.delegatorId.disable();
        }

        this.loademployees();
      });
  }

  initValues() {
    if (this.isFromUserPreferences()) {
      this.departmentId.setValue(
        this.employeeService.getLoginData()?.internalUser.defaultOUId,
      );
      this.delegatorId.setValue(
        this.employeeService.getLoginData()?.internalUser.id,
      );
    }
  }

  setUserDepartments() {
    if (this.isFromUserPreferences()) {
      this.departments = this.employeeService.getOrganizationUnits();
    } else {
      this.departmentService.loadAsLookups().subscribe(deps => {
        this.departments = deps;
      });
    }
  }

  loademployees() {
    if (this.isFromUserPreferences()) {
      if (!this.employees.length)
        this.internalUserService
          .getPreferencesEmployees()
          .subscribe(users => (this.employees = users));
    } else {
      this.departmentId.value &&
        this.internalUserService
          .getAdminEmployees(this.departmentId.value!)
          .subscribe(users => (this.employees = users));
    }
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): UserDelegation | Observable<UserDelegation> {
    return new UserDelegation().clone<UserDelegation>({
      ...this.model,
      ...this.form.getRawValue(),
      delegationType: this.type,
    });
  }

  protected _afterSave(model: UserDelegation): void {
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

  getDelegatees() {
    return this.employees.filter(u => u.id !== this.delegatorId.value);
  }

  getDelegators() {
    return this.employees.filter(u => u.id !== this.delegateeId.value);
  }

  isFromUserPreferences() {
    return this.type === UserDelegationType.PREFERENCES;
  }
}
