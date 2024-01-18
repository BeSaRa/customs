import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Services } from '@models/services';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-services-popup',
  templateUrl: './services-popup.component.html',
  styleUrls: ['./services-popup.component.scss'],
})
export class ServicesPopupComponent extends AdminDialogComponent<Services> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Services> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): Services | Observable<Services> {
    return new Services().clone<Services>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: Services): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
    this.dialogRef.close(this.model);
  }
}
