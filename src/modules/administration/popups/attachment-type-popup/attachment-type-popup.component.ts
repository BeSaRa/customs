import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { AttachmentType } from '@models/attachment-type';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-attachment-type-popup',
  templateUrl: './attachment-type-popup.component.html',
  styleUrls: ['./attachment-type-popup.component.scss'],
})
export class AttachmentTypePopupComponent extends AdminDialogComponent<AttachmentType> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<AttachmentType> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): AttachmentType | Observable<AttachmentType> {
    return new AttachmentType().clone<AttachmentType>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: AttachmentType): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }));
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }
}
