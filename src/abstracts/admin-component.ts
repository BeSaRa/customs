import { Directive, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  exhaustMap,
  filter,
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
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';

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
    limit: 2,
  });
  lang = inject(LangService);
  reload$ = new ReplaySubject<void>(1);
  filter$ = new ReplaySubject<Partial<M>>(1);
  sort$: ReplaySubject<SortOptionsContract | undefined> = new ReplaySubject<
    SortOptionsContract | undefined
  >(1);

  data$: Observable<M[]> = this._load();

  length = 50;

  create$: Subject<void> = new Subject<void>();
  view$: Subject<M> = new Subject<M>();
  edit$: Subject<M> = new Subject<M>();
  delete$: Subject<M> = new Subject<M>();
  dialog = inject(DialogService);
  toast = inject(ToastService);

  abstract displayedColumns: string[];

  dataSource: AppTableDataSource<M> = new AppTableDataSource<M>(this.data$);

  pageSizeOptions: number[] = [2, 50, 100, 150, 200];
  showFirstLastButtons = true;
  allowMultiSelect = true;
  initialSelection: M[] = [];
  selection = new SelectionModel<M>(
    this.allowMultiSelect,
    this.initialSelection
  );

  get limit(): number {
    return this.paginate$.value.limit;
  }

  protected _load(): Observable<M[]> {
    return of(undefined)
      .pipe(delay(0)) // need it to make little delay till the userFilter input get bind.
      .pipe(
        switchMap(() => {
          return combineLatest([
            this.reload$,
            this.paginate$,
            this.filter$,
            this.sort$,
          ]).pipe(
            switchMap(([, paginationOptions, filter, sort]) => {
              return this.loadComposite
                ? this.service
                    .loadComposite(paginationOptions, filter, sort)
                    .pipe(ignoreErrors())
                : this.service
                    .load(paginationOptions, filter, sort)
                    .pipe(ignoreErrors());
            }),
            tap(({ count }) => {
              this.length = count;
            }),
            map((response) => response.rs)
          );
        })
      );
  }

  ngOnInit(): void {
    this.sort$.next(undefined);
    this.filter$.next({});
    this.reload$.next();

    this._listenToCreate();
    this._listenToEdit();
    this._listenToView();
    this._listenToDelete();
  }

  paginate($event: PageEvent) {
    this.paginate$.next({
      offset: $event.pageSize * $event.pageIndex,
      limit: $event.pageSize,
    });
  }

  sort($event: Sort): void {
    this.sort$.next(
      $event.direction
        ? { sortBy: $event.active, sortOrder: $event.direction }
        : undefined
    );
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
        switchMap((model) => {
          return this.service
            .openCreateDialog(model, this._getEditExtras() as object)
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
        switchMap((model) => {
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
        exhaustMap((model) =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({ x: model.getNames() })
            )
            .afterClosed()
            .pipe(filter((value) => value === UserClick.YES))
            .pipe(
              switchMap(() => {
                return model.delete().pipe(ignoreErrors());
              })
            )
        )
      )
      .subscribe((model) => {
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.getNames() })
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
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }
}
