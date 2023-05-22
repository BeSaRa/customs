import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Broker } from '@models/broker';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-broker-popup',
  templateUrl: './broker-popup.component.html',
  styleUrls: ['./broker-popup.component.scss'],
})
export class BrokerPopupComponent extends AdminDialogComponent<Broker> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Broker> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm(true));
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): Broker | Observable<Broker> {
    return new Broker().clone<Broker>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: Broker): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() })
    );
    // you can close the dialog after save here
    // this.dialogRef.close(this.model);
  }
}
