import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { Component, inject } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { LayoutModel } from '@models/layout-model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout-popup',
  templateUrl: './layout-popup.component.html',
  styleUrl: './layout-popup.component.scss',
})
export class LayoutPopupComponent extends AdminDialogComponent<LayoutModel> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<LayoutModel> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): LayoutModel | Observable<LayoutModel> {
    return new LayoutModel().clone<LayoutModel>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: LayoutModel): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.dialogRef.close(this.model);
  }
}
