import { Directive, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  filter,
  iif,
  Observable,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { AdminComponentContract } from '@contracts/admin-component-contract';
import { EmployeeService } from '@services/employee.service';
import { AppTableDataSource } from '@models/app-table-data-source';
import { PageEvent } from '@angular/material/paginator';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { BaseModel } from '@abstracts/base-model';
import { BaseCrudWithDialogServiceContract } from '@contracts/base-crud-with-dialog-service-contract';

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
    limit: 50,
  });
  lang = inject(LangService);
  reload$ = new ReplaySubject<void>(1);
  filter$ = new ReplaySubject<Partial<M>>(1);
  sort$: Observable<unknown> = new Subject();

  useFilter = true;
  data$: Observable<M[]> = this.loadCorrectData();

  create$ = new Subject<void>();
  view$ = new Subject<M>();
  edit$ = new Subject<M>();
  delete$ = new Subject<M>();

  abstract displayedColumns: string[];

  dataSource: AppTableDataSource<M> = new AppTableDataSource<M>(this.data$);

  pageSizeOptions: number[] = [50, 100, 150, 200];
  showFirstLastButtons = true;

  private loadCorrectData(): Observable<M[]> {
    return of(undefined)
      .pipe(delay(0)) // need it to make little delay till the userFilter input get bind.
      .pipe(
        switchMap(() => {
          return iif(
            () => this.useFilter,
            combineLatest([this.filter$, this.paginate$, this.reload$]).pipe(
              switchMap(([filter, paginationOptions]) => {
                return this.service.filter(filter, paginationOptions);
              })
            ),
            combineLatest([this.paginate$, this.reload$]).pipe(
              switchMap(([paginationOptions]) => {
                return this.service.load(paginationOptions);
              })
            )
          );
        })
      );
  }

  ngOnInit(): void {
    this.filter$.next({ enName: 'login' } as M);
    this.reload$.next();

    this.listenToCreate();
    this.listenToEdit();
    this.listenToView();
  }

  paginate($event: PageEvent) {
    this.paginate$.next({
      offset: $event.pageSize * ($event.pageIndex + 1),
      limit: $event.pageSize,
    });
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
