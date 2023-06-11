import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { Broker } from '@models/broker';
import { AdminDialogComponent } from '@abstracts/admin-dialog-component';
import { UntypedFormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { OperationType } from '@enums/operation-type';
import { StatusTypes } from '@enums/status-types';
import { BrokerCompany } from '@models/broker-company';
import { BrokerCompanyService } from '@services/broker-company.service';

@Component({
  selector: 'app-broker-popup',
  templateUrl: './broker-popup.component.html',
  styleUrls: ['./broker-popup.component.scss'],
})
export class BrokerPopupComponent extends AdminDialogComponent<Broker> {
  brokerCompanyService = inject(BrokerCompanyService);

  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Broker> = inject(MAT_DIALOG_DATA);
  brokerCompanies!: BrokerCompany[];

  getBrokerCompaniesAsLookUp() {
    this.brokerCompanyService.loadAsLookups().subscribe(data => {
      this.brokerCompanies = data;
    });
  }

  protected override _init() {
    super._init();
    this.getBrokerCompaniesAsLookUp();
  }

  _buildForm(): void {
    this.form = this.fb.group(this.model.buildForm());
  }

  protected _beforeSave(): boolean | Observable<boolean> {
    return false;
  }

  protected _prepareModel(): Broker | Observable<Broker> {
    return new Broker().clone<Broker>({
      ...this.model,
    });
  }

  protected _afterSave(model: Broker): void {
    return;
  }
}
