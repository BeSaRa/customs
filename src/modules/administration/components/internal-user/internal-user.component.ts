import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { InternalUser } from '@models/internal-user';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { UserPreferencesService } from '@services/user-preferences.service';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { StatusTypes } from '@enums/status-types';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';

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
  commonStatus: Lookup[] = this.lookupService.lookups.commonStatus.filter(
    (s) => s.lookupKey != StatusTypes.DELETED
  );

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
    }
  ];

  override columnsWrapper: ColumnsWrapper<InternalUser> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('domainName'),
    new TextFilterColumn('qid'),
    new TextFilterColumn('empNum'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames'
    ),
    new TextFilterColumn('email'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);

  getStatusString(status: number) {
    return status === StatusTypes.ACTIVE ? 'Active' : 'Disable';
  }
}
