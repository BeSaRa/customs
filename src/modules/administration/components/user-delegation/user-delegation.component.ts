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
import { ConfigService } from '@services/config.service';

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
  config = inject(ConfigService);
  service = inject(UserDelegationService);
  actions: ContextMenuActionContract<UserDelegation>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<UserDelegation> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('delegator'),
    new TextFilterColumn('delegatee'),
    new TextFilterColumn('department'),
    new TextFilterColumn('startDate'),
    new TextFilterColumn('endDate'),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  isDelegator(element: UserDelegation) {
    return this.employeeService.getEmployee()?.id === element.delegatorId;
  }
}
