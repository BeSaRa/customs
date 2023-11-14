import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppTableDataSource } from '@models/app-table-data-source';
import { CaseAttachment } from '@models/case-attachment';
import { combineLatest, delay, exhaustMap, filter, map, Observable, of, ReplaySubject, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { ignoreErrors } from '@utils/utils';
import { Config } from '@constants/config';

@Component({
  selector: 'app-case-attachments',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSortModule, MatTableModule, MatCardModule],
  templateUrl: './case-attachments.component.html',
  styleUrls: ['./case-attachments.component.scss'],
})
export class CaseAttachmentsComponent extends OnDestroyMixin(class {}) implements OnInit {
  protected readonly Config = Config;
  view$ = new Subject<CaseAttachment>();
  reload$ = new ReplaySubject<void>(1);
  delete$ = new Subject<CaseAttachment>();
  dialog = inject(DialogService);
  toast = inject(ToastService);
  @Input()
  type: 'folder' | 'offender' = 'folder';
  @Input()
  entityId!: number;
  @Input()
  caseId?: string;
  @Input()
  disabled = false;
  @Input()
  title?: string;
  @Input()
  service!: BaseCaseService<unknown>;
  @Input()
  readonly = false;

  lang = inject(LangService);

  dataSource: AppTableDataSource<CaseAttachment> = new AppTableDataSource<CaseAttachment>(this._load());

  displayedColumns: string[] = ['documentTitle', 'attachmentType', 'creationDate', 'actions'];

  ngOnInit(): void {
    this.reload$.next();

    this.listenToView();
    this.listenToDelete();
  }

  private _load(): Observable<CaseAttachment[]> {
    return of(undefined)
      .pipe(delay(0))
      .pipe(
        switchMap(() => {
          return combineLatest([this.reload$]).pipe(
            switchMap(() => {
              switch (this.type) {
                case 'folder':
                  return this.caseId ? this.service.loadFolderAttachments(this.caseId) : of([]);
                case 'offender':
                  return this.entityId ? this.service.getOffenderAttachments(this.entityId) : of([]);
                default:
                  return of([]);
              }
            })
          );
        })
      )
      .pipe(takeUntil(this.destroy$));
  }

  sort($event: Sort) {
    console.log('SORT');
  }

  openAddDialog() {
    if (!this.caseId && !this.entityId) {
      this.dialog.error(this.lang.map.add_violation_first_to_take_this_action);
      return;
    }
    this.service
      .openAddAttachmentDialog(this.caseId as string, this.service, this.type, this.entityId)
      .afterClosed()
      .subscribe(() => {
        this.reload$.next();
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return item.view(this.service);
        })
      )
      .subscribe();
  }

  private listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return this.dialog
            .confirm(this.lang.map.msg_delete_x_confirm.change({ x: item.documentTitle }))
            .afterClosed()
            .pipe(
              map(userClick => {
                return { userClick: userClick, item };
              })
            );
        })
      )
      .pipe(filter(response => response.userClick === UserClick.YES))
      .pipe(
        exhaustMap(response =>
          response.item
            .delete(this.service)
            .pipe(ignoreErrors())
            .pipe(map(() => response.item))
        )
      )
      .pipe(tap(item => this.toast.success(this.lang.map.msg_delete_x_success.change({ x: item.documentTitle }))))
      .subscribe(() => this.reload$.next());
  }
}
