import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { UserDelegation } from '@models/user-delegation';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-user-delegation-popup',
  templateUrl: './user-delegation-popup.component.html',
  styleUrls: ['./user-delegation-popup.component.scss'],
})
export class UserDelegationPopupComponent extends AdminDialogComponent<UserDelegation> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserDelegation> = inject(MAT_DIALOG_DATA);

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
      ...this.form.value,
    });
  }

  protected _afterSave(model: UserDelegation): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here 
    // this.dialogRef.close(this.model);
  }
}
