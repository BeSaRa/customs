import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { PermissionRole } from '@models/permission-role';
import { PermissionRoleService } from '@services/permission-role.service';
import { PermissionRolePopupComponent } from '@modules/administration/popups/permission-role-popup/permission-role-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { StatusTypes } from '@enums/status-types';

@Component({
  selector: 'app-permission-role',
  templateUrl: './permission-role.component.html',
  styleUrls: ['./permission-role.component.scss'],
})
export class PermissionRoleComponent extends AdminComponent<
  PermissionRolePopupComponent,
  PermissionRole,
  PermissionRoleService
> {
  service = inject(PermissionRoleService);
  actions: ContextMenuActionContract<PermissionRole>[] = [
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
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<PermissionRole> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('description'),
    new SelectFilterColumn(
      'status',
      this.lookupService.lookups.commonStatus.filter(
        i => i.lookupKey !== StatusTypes.DELETED,
      ),
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
