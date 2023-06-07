import { Directive, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  exhaustMap,
  filter,
  finalize,
  map,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AdminComponentContract } from '@contracts/admin-component-contract';
import { EmployeeService } from '@services/employee.service';
import { AppTableDataSource } from '@models/app-table-data-source';
import { PageEvent } from '@angular/material/paginator';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { BaseModel } from '@abstracts/base-model';
import { BaseCrudWithDialogServiceContract } from '@contracts/base-crud-with-dialog-service-contract';
import { SortOptionsContract } from '@contracts/sort-options-contract';
import { Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ignoreErrors, objectHasOwnProperty } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { LookupService } from '@services/lookup.service';

@Directive({})
export abstract class AdminComponent<
    C,
    M extends BaseModel<M, BaseCrudWithDialogServiceContract<C, M>>,
    S extends BaseCrudWithDialogService<C, M, PrimaryType>,
    PrimaryType = number
  >
  extends OnDestroyMixin(class {})
  implements AdminComponentContract<M, S>, OnInit
{
  // noinspection JSUnusedGlobalSymbols
  protected employeeService = inject(EmployeeService);
  protected loadComposite = true;

  abstract service: S;
  private paginate$ = new BehaviorSubject({
    offset: 0,
    limit: 50,
  });
  lang = inject(LangService);
  reload$ = new ReplaySubject<void>(1);
  filter$ = new BehaviorSubject<Partial<M>>({});
  sort$: ReplaySubject<SortOptionsContract | undefined> = new ReplaySubject<SortOptionsContract | undefined>(1);

  data$: Observable<M[]> = this._load();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  length = 50;

  create$: Subject<void> = new Subject<void>();
  view$: Subject<M> = new Subject<M>();
  edit$: Subject<M> = new Subject<M>();
  delete$: Subject<M> = new Subject<M>();
  status$: Subject<M> = new Subject<M>();
  dialog = inject(DialogService);
  toast = inject(ToastService);
  abstract actions: ContextMenuActionContract<M>[];
  // as of now we have implemented 3 types of columns [TextFilterColumn, SelectFilterColumn, NoneFilterColumn]
  // and soon we will implement [DateFilterColumn]
  abstract columnsWrapper: ColumnsWrapper<M>;
  dataSource: AppTableDataSource<M> = new AppTableDataSource<M>(this.data$);
  pageSizeOptions: number[] = [50, 100, 150, 200];
  showFirstLastButtons = true;
  allowMultiSelect = true;
  initialSelection: M[] = [];
  selection = new SelectionModel<M>(this.allowMultiSelect, this.initialSelection);

  lookupService = inject(LookupService);

  get limit(): number {
    return this.paginate$.value.limit;
  }

  protected _load(): Observable<M[]> {
    return of(undefined)
      .pipe(delay(0)) // need it to make little delay till the userFilter input get bind.
      .pipe(
        switchMap(() => {
          return combineLatest([this.reload$, this.paginate$, this.filter$, this.sort$]).pipe(
            switchMap(([, paginationOptions, filter, sort]) => {
              this.selection.clear();
              this.loadingSubject.next(true);
              return (
                this.loadComposite ? this.service.loadComposite(paginationOptions, filter, sort) : this.service.load(paginationOptions, filter, sort)
              ).pipe(
                finalize(() => this.loadingSubject.next(false)),
                ignoreErrors()
              );
            }),
            tap(({ count }) => {
              this.length = count;
              this.loadingSubject.next(false); //TODO move to finalize in loadComposite and load
            }),
            map(response => response.rs)
          );
        })
      );
  }

  ngOnInit(): void {
    this.sort$.next(undefined);
    this.reload$.next();

    this._listenToCreate();
    this._listenToEdit();
    this._listenToView();
    this._listenToDelete();
    this._listenToChangeStatus();
  }

  paginate($event: PageEvent) {
    this.paginate$.next({
      offset: $event.pageSize * $event.pageIndex,
      limit: $event.pageSize,
    });
  }

  sort($event: Sort): void {
    this.sort$.next($event.direction ? { sortBy: $event.active, sortOrder: $event.direction } : undefined);
  }

  /**
   * listen to create event
   * @protected
   */
  protected _listenToCreate() {
    this.create$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return this.service
            .openCreateDialog(undefined, this._getCreateExtras() as object)
            .afterClosed()
            .pipe(
              filter((model): model is M => {
                return this.service.isInstanceOf(model);
              })
            );
        })
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }

  /**
   * listen to edit event
   * @protected
   */
  protected _listenToEdit() {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model => {
          console.log('to edit model: ', model);

          return this.service
            .openEditDialog(model, this._getEditExtras() as object)
            .afterClosed()
            .pipe(
              filter((model): model is M => {
                return this.service.isInstanceOf(model);
              })
            );
        })
      )
      .subscribe(() => {
        this.reload$.next();
      });
  }

  /**
   * listen to view event
   * @protected
   */
  protected _listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(model => {
          return this.service
            .openViewDialog(model, this._getViewExtras() as object)
            .afterClosed()
            .pipe(filter(() => this._reloadWhenViewPopupClosed()));
        })
      )
      .subscribe(() => this.reload$.next());
  }

  /**
   * listen to delete event
   * @protected
   */
  protected _listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model =>
          this.dialog
            .confirm(this.lang.map.msg_delete_x_confirm.change({ x: model.getNames() }))
            .afterClosed()
            .pipe(filter(value => value === UserClick.YES))
            .pipe(
              switchMap(() => {
                this.loadingSubject.next(true);
                return model
                  .delete()
                  .pipe(
                    finalize(() => this.loadingSubject.next(false)),
                    ignoreErrors()
                  )
                  .pipe(map(() => model));
              })
            )
        )
      )
      .subscribe(model => {
        this.toast.success(this.lang.map.msg_delete_x_success.change({ x: model.getNames() }));
        this.reload$.next();
      });
  }

  protected _listenToChangeStatus() {
    this.status$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model => {
          this.loadingSubject.next(true);
          return model.toggleStatus().pipe(
            // Updating statusInfo is done in baseModel and no need for it here
            finalize(() => this.loadingSubject.next(false)),
            ignoreErrors()
          );
        })
      )
      .subscribe(model => {
        this.toast.success(
          this.lang.map.msg_status_x_changed_success.change({
            x: model.getNames(),
          })
        );
        this.reload$.next();
      });
  }

  /**
   * @description this method you can implement it, in child class if you need to add extra props to the create dialog
   */
  _getCreateExtras(): unknown {
    return undefined;
  }

  /**
   * @description this method you can implement it, in child class if you need to add extra props to the create dialog
   */
  _getViewExtras(): unknown {
    return undefined;
  }

  /**
   * @description this method you can implement it, in child class if you need to add extra props to the edit dialog
   */
  _getEditExtras(): unknown {
    return undefined;
  }

  /**
   * @description return true to reload after closing the viewPopup
   */
  _reloadWhenViewPopupClosed(): boolean {
    return false;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return this.selection.selected.length == this.dataSource.data.length;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    this.isAllSelected() ? this.selection.clear() : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  filterChange($event: { key: string; value: string | null }) {
    if (
      // Comparing value with null only makes a problem when value is 0 (falsy)
      $event.value === null ||
      $event.value === undefined ||
      $event.value === ''
    ) {
      delete this.filter$.value[$event.key as keyof M];
      this.filter$.next({ ...this.filter$.value });
      return;
    }
    this.filter$.next({
      ...this.filter$.value,
      [$event.key]: $event.value,
    });
  }

  getFilterStringColumn(column: string): string {
    return objectHasOwnProperty(this.filter$.value, column) ? (this.filter$.value[column as keyof M] as string) : '';
  }
}
