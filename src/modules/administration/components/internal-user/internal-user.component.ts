import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { InternalUser } from '@models/internal-user';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { UserPreferencesService } from '@services/user-preferences.service';


@Component({
  selector: 'app-internal-user',
  templateUrl: './internal-user.component.html',
  styleUrls: ['./internal-user.component.scss'],
})
export class InternalUserComponent extends AdminComponent<
  InternalUserPopupComponent,
  InternalUser,
  InternalUserService
> {
  service = inject(InternalUserService);

  userPreferencesService = inject(UserPreferencesService);
    
  displayedColumns: string[] = [
    'select',
    'domainName',
    'arName',
    'enName',
    'empNum',
    'email',
    'phoneNumber',
    'actions'
  ];

  actions: ContextMenuActionContract<InternalUser>[] = [
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
    // {
    //   name:'user preferences',
    //   type: 'action',
    //   icon: AppIcons.ACCOUNT_EDIT,
    //   label: 'user_preferences',
    //   callback: (item) => {
    //     this.openUserPreferences(item.userPreferences, item)
    //   }
    // }
  ];

  // openUserPreferences(item: UserPreferences, user: InternalUser) {
  //   this.userPreferencesService.openEditDialog(item, {user})
  // }
}
