import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { BrokerCompany } from '@models/broker-company';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';

@Component({
  selector: 'app-broker-company-popup',
  templateUrl: './broker-company-popup.component.html',
  styleUrls: ['./broker-company-popup.component.scss'],
})
export class BrokerCompanyPopupComponent extends AdminDialogComponent<BrokerCompany> {
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<BrokerCompany> = inject(MAT_DIALOG_DATA);

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    return false;
  }

  protected _prepareModel(): BrokerCompany | Observable<BrokerCompany> {
    return new BrokerCompany().clone<BrokerCompany>({
      ...this.model,
    });
  }

  protected _afterSave(model: BrokerCompany): void {
    this.dialogRef.close(this.model);
  }
}
