import {
  Component,
  effect,
  inject,
  input,
  Input,
  InputSignal,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppTableDataSource } from '@models/app-table-data-source';
import { CaseAttachment } from '@models/case-attachment';
import {
  exhaustMap,
  filter,
  map,
  of,
  ReplaySubject,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { downloadLink, ignoreErrors } from '@utils/utils';
import { Config } from '@constants/config';
import { FolderType } from '@enums/folder-type.enum';

@Component({
  selector: 'app-case-attachments',
  standalone: true,
  imports: [
    CommonModule,
    IconButtonComponent,
    MatSortModule,
    MatTableModule,
    MatCardModule,
  ],
  templateUrl: './case-attachments.component.html',
  styleUrls: ['./case-attachments.component.scss'],
})
export class CaseAttachmentsComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly Config = Config;
  view$ = new Subject<CaseAttachment>();
  reload$ = new ReplaySubject<void>(1);
  delete$ = new Subject<CaseAttachment>();
  dialog = inject(DialogService);
  toast = inject(ToastService);
  protected readonly FolderType = FolderType;
  caseId: InputSignal<string | undefined> = input();
  @Input()
  folderType!: FolderType;
  @Input()
  type: 'folder' | 'offender' = 'folder';
  @Input()
  entityId!: number;
  @Input()
  disabled = false;
  @Input()
  title?: string;
  @Input()
  service!: BaseCaseService<unknown>;
  @Input()
  readonly = false;

  lang = inject(LangService);
  data: Subject<CaseAttachment[]> = new Subject<CaseAttachment[]>();
  dataSource: AppTableDataSource<CaseAttachment> =
    new AppTableDataSource<CaseAttachment>(this.data);

  displayedColumns: string[] = [
    'documentTitle',
    'attachmentType',
    'creationDate',
    'creator',
    'actions',
  ];
  constructor() {
    super();
    effect(() => {
      if (this.caseId()) {
        this.reload$.next();
      }
    });
  }
  ngOnInit(): void {
    this.listenToView();
    this.listenToDelete();
    this._load();
    this.reload$.next();
    if (this.folderType === FolderType.OFFICIAL) {
      this.displayedColumns.shift();
    }
  }

  private _load() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          switch (this.type) {
            case 'folder':
              return this.caseId()
                ? this.service.loadFolderAttachments(this.caseId() as string)
                : of([]);
            case 'offender':
              return this.entityId
                ? this.service.getOffenderAttachments(this.entityId)
                : of([]);
            default:
              return of([]);
          }
        }),
      )
      .subscribe(data => {
        this.data.next(data);
      });
  }

  sort($event: Sort) {
    console.log('SORT', $event);
  }

  openAddDialog() {
    if (!this.caseId() && !this.entityId) {
      this.dialog.error(this.lang.map.add_violation_first_to_take_this_action);
      return;
    }
    this.service
      .openAddAttachmentDialog(
        this.caseId() as string,
        this.service,
        this.type,
        this.entityId,
      )
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
          if (item.isApproved) {
            return item.view(this.service);
          } else {
            return this.service.downloadAttachment(item.id).pipe(
              tap(blob => {
                downloadLink(blob.url, item.mimeType);
              }),
            );
          }
        }),
      )
      .subscribe();
  }

  private listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: item.documentTitle,
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => {
                return { userClick: userClick, item };
              }),
            );
        }),
      )
      .pipe(filter(response => response.userClick === UserClick.YES))
      .pipe(
        exhaustMap(response =>
          response.item
            .delete(this.service)
            .pipe(ignoreErrors())
            .pipe(map(() => response.item)),
        ),
      )
      .pipe(
        tap(item =>
          this.toast.success(
            this.lang.map.msg_delete_x_success.change({
              x: item.documentTitle,
            }),
          ),
        ),
      )
      .subscribe(() => this.reload$.next());
  }
  resetDataList() {
    this.data.next([]);
  }
}
