import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { ClearingAgent } from '@models/clearing-agent';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-clearing-agent-popup',
  templateUrl: './clearing-agent-popup.component.html',
  styleUrls: ['./clearing-agent-popup.component.scss'],
})
export class ClearingAgentPopupComponent extends AdminDialogComponent<ClearingAgent> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<ClearingAgent> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _prepareModel(): ClearingAgent | Observable<ClearingAgent> {
    return new ClearingAgent().clone<ClearingAgent>({
      ...this.model,
      ...this.form.value,
    });
  }

  protected _afterSave(model: ClearingAgent): void {
    this.model = model;
    this.operation = OperationType.UPDATE;
    this.toast.success(
      this.lang.map.msg_save_x_success.change({ x: this.model.getNames() }),
    );
  }
}
