import { Component, EventEmitter, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { InternalUserOU } from '@models/internal-user-ou';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { InternalUserOUPopupComponent } from '@modules/administration/popups/internal-user-ou-popup/internal-user-ou-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-internal-user-ou',
  templateUrl: './internal-user-ou.component.html',
  styleUrls: ['./internal-user-ou.component.scss'],
})
export class InternalUserOUComponent extends AdminComponent<InternalUserOUPopupComponent, InternalUserOU, InternalUserOUService> {
  override ngOnInit(): void {
    super.ngOnInit();
    this.filter$.next({ internalUserId: 3 });
  }
  service = inject(InternalUserOUService);
  actions: ContextMenuActionContract<InternalUserOU>[] = [
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
  columnsWrapper: ColumnsWrapper<InternalUserOU> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('internalUserId'),
    new TextFilterColumn('organizationUnitId'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);
}
