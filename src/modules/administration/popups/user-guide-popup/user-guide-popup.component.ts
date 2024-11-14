import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { UserGuide } from '@models/user-guide';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-user-guide-popup',
  templateUrl: './user-guide-popup.component.html',
  styleUrls: ['./user-guide-popup.component.scss'],
  standalone: true,
})
export class UserGuidePopupComponent extends AdminDialogComponent<UserGuide> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<UserGuide> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): UserGuide | Observable<UserGuide> {
    return new UserGuide().clone<UserGuide>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: UserGuide): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    // you can close the dialog after save here
    this.dialogRef.close(this.model);
  }
}
