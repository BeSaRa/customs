import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { BrokerCompany } from '@models/broker-company';
import { BrokerCompanyService } from '@services/broker-company.service';
import { BrokerCompanyPopupComponent } from '@modules/administration/popups/broker-company-popup/broker-company-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-broker-company',
  templateUrl: './broker-company.component.html',
  styleUrls: ['./broker-company.component.scss'],
})
export class BrokerCompanyComponent extends AdminComponent<BrokerCompanyPopupComponent, BrokerCompany, BrokerCompanyService> {
  service = inject(BrokerCompanyService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter((s) => s.lookupKey != StatusTypes.DELETED);

  actions: ContextMenuActionContract<BrokerCompany>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: (item) => {
        this.view$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<BrokerCompany> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('email'),
    new TextFilterColumn('licenseNumber'),
    new TextFilterColumn('code'),
    new TextFilterColumn('commercialRecord'),
    // new TextFilterColumn('begingEstablished'),
    // new TextFilterColumn('phoneNumber'),
    // new TextFilterColumn('address'),
    // new TextFilterColumn('responsibleName'),
    // new TextFilterColumn('bokerCompanyPenalties'),
    new SelectFilterColumn('status', this.commonStatus, 'lookupKey', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
