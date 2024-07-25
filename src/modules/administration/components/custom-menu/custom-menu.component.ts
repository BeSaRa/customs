import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { CustomMenu } from '@models/custom-menu';
import { CustomMenuService } from '@services/custom-menu.service';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { MenuItemService } from '@services/menu-item.service';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { StatusTypes } from '@enums/status-types';

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
  usePagination = true;
  useCompositeToLoad = false;
  menuItemService = inject(MenuItemService);
  commonStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    lookupItem => lookupItem.lookupKey !== StatusTypes.DELETED,
  );

  columnsWrapper: ColumnsWrapper<CustomMenu> = new ColumnsWrapper(
    new NoneFilterColumn('select'),
    new TextFilterColumn('arName'),
    new TextFilterColumn('enName'),
    new TextFilterColumn('menuType'),
    new SelectFilterColumn(
      'status',
      this.commonStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  @Input() parent?: CustomMenu;
  @Input() readonly: boolean = false;
  @Output() listUpdated: EventEmitter<unknown> = new EventEmitter<unknown>();
  selectedPopupTabName: string = 'basic';

  actions: ContextMenuActionContract<CustomMenu>[] = [
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

  // displayedColumns = [
  //   'select',
  //   'arName',
  //   'enName',
  //   'menuType',
  //   'systemParent',
  //   'status',
  //   'actions',
  // ];
  // isClaimedEffect = effect(() => {
  //   if (!this.isParentDefaultItem()) {
  //     this.displayedColumns = [
  //       ...this.displayedColumns.filter(column => column !== 'systemParent'),
  //     ];
  //   } else {
  //     this.displayedColumns = [
  //       'rowSelection',
  //       'arName',
  //       'enName',
  //       'menuType',
  //       'systemParent',
  //       'status',
  //       'actions',
  //     ];
  //   }
  // });

  isParentDefaultItem(): boolean {
    return !!this.parent && this.parent.isDefaultItem();
  }
}
