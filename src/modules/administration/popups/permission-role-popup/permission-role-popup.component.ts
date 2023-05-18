import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { PermissionRole } from '@models/permission-role';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-permission-role-popup',
  templateUrl: './permission-role-popup.component.html',
  styleUrls: ['./permission-role-popup.component.scss'],
})
export class PermissionRolePopupComponent extends AdminDialogComponent<PermissionRole> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<PermissionRole> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): PermissionRole | Observable<PermissionRole> {
    return new PermissionRole().clone<PermissionRole>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: PermissionRole): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }
}
