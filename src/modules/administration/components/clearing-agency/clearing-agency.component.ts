import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ClearingAgency } from '@models/clearing-agency';
import { ClearingAgencyService } from '@services/clearing-agency.service';
import { ClearingAgencyPopupComponent } from '@modules/administration/popups/clearing-agency-popup/clearing-agency-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { Lookup } from '@models/lookup';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-clearing-agency',
  templateUrl: './clearing-agency.component.html',
  styleUrls: ['./clearing-agency.component.scss'],
})
export class ClearingAgencyComponent extends AdminComponent<ClearingAgencyPopupComponent, ClearingAgency, ClearingAgencyService> {
  service = inject(ClearingAgencyService);
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(s => s.lookupKey != StatusTypes.DELETED);
  actions: ContextMenuActionContract<ClearingAgency>[] = [
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
    {
      name: 'more-details',
      type: 'info',
      label: 'more_details',
      icon: AppIcons.MORE_DETAILS,
    },
    {
      name: 'email',
      type: 'info',
      label: item => `${this.lang.map.email} : ${item.email}`,
      parent: 'more-details',
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<ClearingAgency> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('licenseNo'),
    new TextFilterColumn('customCode'),
    new TextFilterColumn('crNo'),
    new TextFilterColumn('telNo'),
    new TextFilterColumn('address'),
    new TextFilterColumn('accountAdminFullName'),
    new SelectFilterColumn('status', this.commonStatus, 'lookupKey', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
