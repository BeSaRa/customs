import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { CustomMenu } from '@models/custom-menu';
import { CustomMenuService } from '@services/custom-menu.service';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { TextFilterColumn } from '@models/text-filter-column';
import { NoneFilterColumn } from '@models/none-filter-column';

@Component({
  selector: 'app-custom-menu',
  templateUrl: './custom-menu.component.html',
  styleUrls: ['./custom-menu.component.scss'],
})
export class CustomMenuComponent extends AdminComponent<
  CustomMenuPopupComponent,
  CustomMenu,
  CustomMenuService
> {
  service = inject(CustomMenuService);
  actions: ContextMenuActionContract<CustomMenu>[] = [
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
    columnsWrapper: ColumnsWrapper<CustomMenu> = new ColumnsWrapper(
      new NoneFilterColumn('select'),
      new TextFilterColumn('arName'),
      new NoneFilterColumn('actions')
    ).attacheFilter(this.filter$);
}
