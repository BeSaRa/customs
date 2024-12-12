import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { UserDelegation } from '@models/user-delegation';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { ReactiveFormsModule, UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { InternalUser } from '@models/internal-user';
import { InternalUserService } from '@services/internal-user.service';
import { OrganizationUnit } from '@models/organization-unit';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { EmployeeService } from '@services/employee.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { InputComponent } from '@standalone/components/input/input.component';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { ButtonComponent } from '@standalone/components/button/button.component';

@Component({
  selector: 'app-user-delegation-popup',
  templateUrl: './user-delegation-popup.component.html',
  styleUrls: ['./user-delegation-popup.component.scss'],
  standalone: true,
  imports: [
    IconButtonComponent,
    ReactiveFormsModule,
    SelectInputComponent,
    InputComponent,
    MatDatepicker,
    MatDatepickerInput,
    ButtonComponent,
  ],
})
export class UserDelegationPopupComponent
  extends AdminDialogComponent<UserDelegation>
  implements OnInit
{
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserDelegation> = inject(MAT_DIALOG_DATA);

  internalUsersInSameDepartment!: InternalUser[];
  internalUserService = inject(InternalUserService);
  employeeService = inject(EmployeeService);
  departments!: OrganizationUnit[];
  departmentService = inject(OrganizationUnitService);
  today = new Date();

  override ngOnInit() {
    super.ngOnInit();
    this.loadInternalUsersInSameDepartment();
    this.setUserDepartments();
  }

  loadInternalUsersInSameDepartment() {
    this.internalUserService
      .getInternalUsersInSameDepartment()
      .subscribe(users => (this.internalUsersInSameDepartment = users));
  }

  setUserDepartments() {
    this.departments = this.employeeService.getOrganizationUnits();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected override _afterBuildForm() {
    super._afterBuildForm();
    this.form
      .get('delegatorId')
      ?.setValue(this.employeeService.getEmployee()!.id);
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): UserDelegation | Observable<UserDelegation> {
    return new UserDelegation().clone<UserDelegation>({
      ...this.model,
      ...this.form.getRawValue(),
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
}
