import { Directive, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import {
  BehaviorSubject,
  combineLatest,
  delay,
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

  data$: Observable<M[]> = this.load();

  length = 50;

  create$: Subject<void> = new Subject<void>();
  view$: Subject<M> = new Subject<M>();
  edit$: Subject<M> = new Subject<M>();
  delete$: Subject<M> = new Subject<M>();

  abstract displayedColumns: string[];

  dataSource: AppTableDataSource<M> = new AppTableDataSource<M>(this.data$);

  pageSizeOptions: number[] = [50, 100, 150, 200];
  showFirstLastButtons = true;

  get limit(): number {
    return this.paginate$.value.limit;
  }
  private load(): Observable<M[]> {
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
                ? this.service.loadComposite(paginationOptions, filter, sort)
                : this.service.load(paginationOptions, filter, sort);
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

    this.listenToCreate();
    this.listenToEdit();
    this.listenToView();
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

  private listenToCreate() {
    this.create$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return this.service
            .openCreateDialog(undefined, this.getCreateExtras() as object)
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

  private listenToEdit() {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((model) => {
          return this.service
            .openCreateDialog(model, this.getEditExtras() as object)
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

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap((model) => {
          return this.service
            .openViewDialog(model, this.getViewExtras() as object)
            .afterClosed()
            .pipe(filter(() => this.reloadWhenViewPopupClosed()));
        })
      )
      .subscribe(() => this.reload$.next());
  }

  /**
   * @description this method you can implement it, in child class if you need to add extra props to the create dialog
   */
  getCreateExtras(): unknown {
    return undefined;
  }

  /**
   * @description this method you can implement it, in child class if you need to add extra props to the create dialog
   */
  getViewExtras(): unknown {
    return undefined;
  }

  /**
   * @description this method you can implement it, in child class if you need to add extra props to the edit dialog
   */
  getEditExtras(): unknown {
    return undefined;
  }

  /**
   * @description return true to reload after closing the viewPopup
   */
  reloadWhenViewPopupClosed(): boolean {
    return false;
  }
}
