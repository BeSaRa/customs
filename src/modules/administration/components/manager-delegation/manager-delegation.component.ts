import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { ManagerDelegation } from '@models/manager-delegation';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegationPopupComponent } from '@modules/administration/popups/manager-delegation-popup/manager-delegation-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-manager-delegation',
  templateUrl: './manager-delegation.component.html',
  styleUrls: ['./manager-delegation.component.scss'],
})
export class ManagerDelegationComponent extends AdminComponent<
  ManagerDelegationPopupComponent,
  ManagerDelegation,
  ManagerDelegationService
> {
  service = inject(ManagerDelegationService);
  actions: ContextMenuActionContract<ManagerDelegation>[] = [
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
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: item => {
        this.delete$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<ManagerDelegation> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);
}
