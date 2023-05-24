import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Broker } from '@models/broker';
import { BrokerService } from '@services/broker.service';
import { BrokerPopupComponent } from '@modules/administration/popups/broker-popup/broker-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-broker',
  templateUrl: './broker.component.html',
  styleUrls: ['./broker.component.scss'],
})
export class BrokerComponent extends AdminComponent<
  BrokerPopupComponent,
  Broker,
  BrokerService
> {
  service = inject(BrokerService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(
    (s) => s.lookupKey != StatusTypes.DELETED
  );
  actions: ContextMenuActionContract<Broker>[] = [
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
  columnsWrapper: ColumnsWrapper<Broker> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('qid'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames'
    ),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
