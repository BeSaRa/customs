import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
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
import { exhaustMap, Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';

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
        this.view(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.edit(item);
      },
    },
    {
      name: 'sub_list',
      type: 'action',
      label: 'sub_lists',
      icon: AppIcons.CHILD_ITEMS,
      callback: item => this.showChildren(item),
      // show: () => !this.parent,
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

  isParentDefaultItem(): boolean {
    return !!this.parent && this.parent.isDefaultItem();
  }

  view(model: CustomMenu): void {
    this.selectedPopupTabName = 'basic';
    this.view$.next(model);
  }

  edit(model: CustomMenu): void {
    this.selectedPopupTabName = 'basic';
    this.edit$.next(model);
  }

  showChildren(item: CustomMenu): void {
    this.selectedPopupTabName = 'sub';
    if (this.readonly) {
      this.view$.next(item);
    } else {
      this.edit$.next(item);
    }
  }

  override view$: Subject<CustomMenu> = new Subject<CustomMenu>();

  override _listenToView(): void {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map((model, index) => {
          return this.service.openViewPopup(model, {
            modelId: model.id,
            parentMenu: this.parent,
            selectedPopupTab: this.selectedPopupTabName,
          });
        }),
      )
      .subscribe(() => this.reload$.next());
  }

  override _listenToCreate(): void {
    this.create$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(() =>
          this.service
            .openCreateDialog(new CustomMenu(), { parentMenu: this.parent })
            .afterClosed(),
        ),
      )
      .subscribe(() => this.reload$.next());
  }

  override _listenToEdit(): void {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model => {
          return this.service
            .openEditDialog(model, {
              modelId: model.id,
              parentMenu: this.parent,
              selectedPopupTab: this.selectedPopupTabName,
            })
            .afterClosed();
        }),
      )
      .subscribe(() => this.reload$.next());
  }
}
