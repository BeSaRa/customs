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

@Component({
  selector: 'app-broker-company',
  templateUrl: './broker-company.component.html',
  styleUrls: ['./broker-company.component.scss'],
})
export class BrokerCompanyComponent extends AdminComponent<
  BrokerCompanyPopupComponent,
  BrokerCompany,
  BrokerCompanyService
> {
  service = inject(BrokerCompanyService);
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
      {
        name: 'edit',
        type: 'action',
        label: 'edit',
        icon: AppIcons.EDIT,
        callback: (item) => {
          this.edit$.next(item);
        },
      },
      {
        name: 'delete',
        type: 'action',
        label: 'delete',
        icon: AppIcons.DELETE,
        callback: (item) => {
          this.delete$.next(item);
        },
      },
    ];
    // here we have a new implementation for displayed/filter Columns for the table
    columnsWrapper: ColumnsWrapper<BrokerCompany> = new ColumnsWrapper(
      new NoneFilterColumn('select'),
      new TextFilterColumn('arName'),
      new NoneFilterColumn('actions')
    ).attacheFilter(this.filter$);
}
