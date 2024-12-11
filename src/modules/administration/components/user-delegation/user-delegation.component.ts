import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { UserDelegation } from '@models/user-delegation';
import { UserDelegationService } from '@services/user-delegation.service';
import { UserDelegationPopupComponent } from '@modules/administration/popups/user-delegation-popup/user-delegation-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-user-delegation',
  templateUrl: './user-delegation.component.html',
  styleUrls: ['./user-delegation.component.scss'],
})
export class UserDelegationComponent extends AdminComponent<
  UserDelegationPopupComponent,
  UserDelegation,
  UserDelegationService
> {
  service = inject(UserDelegationService);
  actions: ContextMenuActionContract<UserDelegation>[] = [
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
    columnsWrapper: ColumnsWrapper<UserDelegation> = new ColumnsWrapper(
      new NoneFilterColumn('select'),
      new TextFilterColumn('arName'),
      new NoneFilterColumn('actions')
    ).attacheFilter(this.filter$);
}
