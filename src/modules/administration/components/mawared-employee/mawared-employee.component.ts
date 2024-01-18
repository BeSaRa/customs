import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { MawaredEmployee } from '@models/mawared-employee';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { MawaredEmployeePopupComponent } from '@modules/administration/popups/mawared-employee-popup/mawared-employee-popup.component';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-mawared-employee',
  templateUrl: './mawared-employee.component.html',
  styleUrls: ['./mawared-employee.component.scss'],
})
export class MawaredEmployeeComponent extends AdminComponent<
  MawaredEmployeePopupComponent,
  MawaredEmployee,
  MawaredEmployeeService
> {
  service = inject(MawaredEmployeeService);
  commonStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    lookupItem => lookupItem.lookupKey !== StatusTypes.DELETED,
  );
  actions: ContextMenuActionContract<MawaredEmployee>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
    {
      name: 'audit',
      type: 'action',
      label: 'audit',
      icon: AppIcons.HISTORY,
      callback: item => {
        this.viewAudit$.next(item);
      },
    },
  ];

  columnsWrapper: ColumnsWrapper<MawaredEmployee> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('qid'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
