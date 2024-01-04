import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { OrganizationUnit } from '@models/organization-unit';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { OrganizationUnitPopupComponent } from '@modules/administration/popups/organization-unit-popup/organization-unit-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';
import { InternalUserService } from '@services/internal-user.service';

@Component({
  selector: 'app-organization-unit',
  templateUrl: './organization-unit.component.html',
  styleUrls: ['./organization-unit.component.scss'],
})
export class OrganizationUnitComponent extends AdminComponent<OrganizationUnitPopupComponent, OrganizationUnit, OrganizationUnitService> {
  service = inject(OrganizationUnitService);

  internalUserService = inject(InternalUserService);
  actions: ContextMenuActionContract<OrganizationUnit>[] = [
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
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.edit$.next(item);
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
    {
      name: 'ldap_group_name',
      type: 'info',
      label: item => `${this.lang.map.ldap_group_name} : ${item.ldapGroupName}`,
      parent: 'more-details',
    },
    {
      name: 'ldap_limited_group_name',
      type: 'info',
      label: item => `${this.lang.map.ldap_limited_group_name} : ${item.ldapLimitedGroupName}`,
      parent: 'more-details',
    },
  ];

  columnsWrapper: ColumnsWrapper<OrganizationUnit> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus.filter(item => item.lookupKey !== StatusTypes.DELETED),
      'lookupKey',
      'getNames'
    ),
    new TextFilterColumn('mawaredDepId'),
    new SelectFilterColumn('assistantOuId', this.service.loadOUsByType(), 'id', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
