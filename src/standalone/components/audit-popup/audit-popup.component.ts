import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BaseModel } from '@abstracts/base-model';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { BehaviorSubject, combineLatest, delay, finalize, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { Audit } from '@models/audit';
import { AppTableDataSource } from '@models/app-table-data-source';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { NoneFilterColumn } from '@models/none-filter-column';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-audit-popup',
  standalone: true,
  imports: [
    CommonModule,
    ContextMenuComponent,
    FilterColumnComponent,
    HighlightPipe,
    IconButtonComponent,
    MatCheckboxModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    MatDialogModule,
    ButtonComponent,
  ],
  templateUrl: './audit-popup.component.html',
  styleUrls: ['./audit-popup.component.scss'],
})
export class AuditPopupComponent implements OnInit {
  ngOnInit(): void {
    this.listenToView();
  }

  data = inject(MAT_DIALOG_DATA);
  model: BaseModel<never, never> = this.data.model;
  service: BaseCrudService<BaseModel<never, never>> = this.model.$$getService$$();
  reload$ = new Subject<void>();
  private paginate$ = new BehaviorSubject({
    offset: 0,
    limit: 50,
  });
  dataSource = new AppTableDataSource(this._load());
  view$ = new Subject<Audit>();
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();
  lang = inject(LangService);
  pageSizeOptions: number[] = [50, 100, 150, 200];
  showFirstLastButtons = true;
  length = 50;

  destroyRef = inject(DestroyRef);

  columnsWrapper: ColumnsWrapper<Audit> = new ColumnsWrapper<Audit>(
    new NoneFilterColumn('ip'),
    new NoneFilterColumn('user'),
    new NoneFilterColumn('operation'),
    new NoneFilterColumn('actions')
  );

  get limit(): number {
    return this.paginate$.value.limit;
  }

  protected _load(): Observable<Audit[]> {
    return of(undefined)
      .pipe(delay(0)) // delay for loadingSubject to be initialized
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(() => {
          this.loadingSubject.next(true);
          return combineLatest([this.paginate$]);
        })
      )
      .pipe(
        switchMap(([pagination]) => {
          this.loadingSubject.next(true);
          return this.service.loadAudit(this.model.id, pagination).pipe(
            finalize(() => this.loadingSubject.next(false)),
            ignoreErrors()
          );
        })
      )
      .pipe(
        tap(result => {
          this.length = result.count;
          this.loadingSubject.next(false); //TODO move to finalize in loadComposite and load
        })
      )
      .pipe(map(pagination => pagination.rs));
  }

  private listenToView() {
    this.view$
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap(audit => {
          return this.service.loadAuditEntityById(audit.id).pipe(ignoreErrors());
        })
      )
      .subscribe(model => {
        model.openView();
      });
  }

  paginate($event: PageEvent) {
    this.paginate$.next({
      offset: $event.pageSize * $event.pageIndex,
      limit: $event.pageSize,
    });
  }
}
