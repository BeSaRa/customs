import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Services } from '@models/services';
import { ServicesService } from '@services/services.service';
import { ServicesPopupComponent } from '@modules/administration/popups/services-popup/services-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss'],
})
export class ServicesComponent extends AdminComponent<
  ServicesPopupComponent,
  Services,
  ServicesService
> {
  service = inject(ServicesService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(
    (s) => s.lookupKey != StatusTypes.DELETED,
  );

  actions: ContextMenuActionContract<Services>[] = [
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
      name: 'audit',
      type: 'action',
      label: 'audit',
      icon: AppIcons.HISTORY,
      callback: (item) => {
        this.viewAudit$.next(item);
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
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<Services> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('bawServiceCode'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('updatedOnString'),
    new TextFilterColumn('updatedByInfo'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
