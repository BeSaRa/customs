import { Component, EventEmitter, Input, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { InternalUserOU } from '@models/internal-user-ou';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { InternalUserOUPopupComponent } from '@modules/administration/popups/internal-user-ou-popup/internal-user-ou-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';
import { InternalUser } from '@models/internal-user';

@Component({
  selector: 'app-internal-user-ou',
  templateUrl: './internal-user-ou.component.html',
  styleUrls: ['./internal-user-ou.component.scss'],
})
export class InternalUserOUComponent extends AdminComponent<InternalUserOUPopupComponent, InternalUserOU, InternalUserOUService> {
  @Input({ required: true }) internalUser!: InternalUser;
  override ngOnInit(): void {
    super.ngOnInit();
    this.filter$.next({ internalUserId: this.internalUser.id });
  }
  service = inject(InternalUserOUService);
  actions: ContextMenuActionContract<InternalUserOU>[] = [
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
  columnsWrapper: ColumnsWrapper<InternalUserOU> = new ColumnsWrapper(
    new TextFilterColumn('organizationUnitId'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);

  override _getCreateExtras(): unknown {
    return { internalUserId: this.internalUser.id };
  }
  override _getEditExtras(): unknown {
    return { internalUserId: this.internalUser.id };
  }
}
