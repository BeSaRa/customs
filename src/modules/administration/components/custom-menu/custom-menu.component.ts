import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { CustomMenu } from '@models/custom-menu';
import { CustomMenuService } from '@services/custom-menu.service';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { StatusTypes } from '@enums/status-types';
import {
  combineLatest,
  delay,
  EMPTY,
  exhaustMap,
  finalize,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { map } from 'rxjs/operators';
import { ignoreErrors } from '@utils/utils';
import { Pagination } from '@models/pagination';
import { CustomMenuSearchCriteria } from '@contracts/custom-menu-search-criteria';
import { OperationType } from '@enums/operation-type';

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
  commonStatus: Lookup[] = inject(LookupService).lookups.commonStatus.filter(
    lookupItem => lookupItem.lookupKey !== StatusTypes.DELETED,
  );
  StatusTypes = StatusTypes;

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
  @Input() operation!: OperationType;

  @Output() listUpdated: EventEmitter<unknown> = new EventEmitter<unknown>();
  selectedPopupTab: number = 0;

  get readOnly() {
    return this.operation === OperationType.VIEW;
  }

  get inCreateMode() {
    return this.operation === OperationType.CREATE;
  }

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
      label: 'sub_custom_menus',
      icon: AppIcons.CHILD_ITEMS,
      callback: item => this.showChildren(item),
      hide: () => !!this.parent,
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

  // isParentDefaultItem(): boolean {
  //   return !!this.parent && this.parent.isDefaultItem();
  // }

  view(model: CustomMenu): void {
    this.selectedPopupTab = 0;
    this.view$.next(model);
  }

  edit(model: CustomMenu): void {
    this.selectedPopupTab = 0;
    this.edit$.next(model);
  }

  showChildren(item: CustomMenu): void {
    this.selectedPopupTab = 2;
    if (this.readOnly) {
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
        exhaustMap(model => {
          return this.service.openViewPopup(model, {
            modelId: model.id,
            parentMenu: this.parent,
            selectedPopupTab: this.selectedPopupTab,
          });
        }),
      )
      .subscribe(() => this.reload$.next());
  }

  override _listenToCreate(): void {
    this.create$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(() => {
          return this.service
            .openCreatePopup(new CustomMenu(), { parentMenu: this.parent })
            .afterClosed();
        }),
      )
      .subscribe(() => this.reload$.next());
  }

  override _listenToEdit(): void {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model => {
          return this.service.openEditPopup(model, {
            modelId: model.id,
            parentMenu: this.parent,
            selectedPopupTab: this.selectedPopupTab,
          });
        }),
      )
      .subscribe(() => this.reload$.next());
  }

  override _load(): Observable<CustomMenu[]> {
    return of(undefined)
      .pipe(delay(0)) // need it to make little delay till the userFilter input get bind.
      .pipe(
        switchMap(() => {
          if (this.inCreateMode) {
            return EMPTY;
          }
          return combineLatest([
            this.reload$,
            this.paginate$,
            this.filter$,
            this.sort$,
          ])
            .pipe(
              switchMap(([, paginationOptions]) => {
                this.selection.clear();
                this.loadingSubject.next(true);
                let loading: Observable<Pagination<CustomMenu[]>>;
                if (this.parent && this.parent.id) {
                  const criteria: Partial<CustomMenuSearchCriteria> = {
                    'parent-menu-item-id': this.parent.id,
                  };
                  loading = this.service.loadByCriteriaPaging(
                    criteria,
                    paginationOptions,
                  );
                } else {
                  loading = this.service.loadMain(paginationOptions);
                }
                return loading.pipe(
                  finalize(() => this.loadingSubject.next(false)),
                  ignoreErrors(),
                );
              }),
            )
            .pipe(map(res => res.rs));
        }),
      );
  }
}
