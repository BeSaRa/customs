import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppTableDataSource } from '@models/app-table-data-source';
import { CaseAttachment } from '@models/case-attachment';
import { of, ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { MatCardModule } from '@angular/material/card';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { CallRequestService } from '@services/call-request.service';

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
  templateUrl: './apology-attachments.component.html',
  styleUrls: ['./apology-attachments.component.scss'],
})
export class ApologyAttachmentsComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  reload$ = new ReplaySubject<void>(1);
  delete$ = new Subject<CaseAttachment>();
  dialog = inject(DialogService);
  toast = inject(ToastService);
  service = inject(CallRequestService);

  @Input()
  offenderId!: number;
  @Input()
  title?: string;
  @Input()
  readonly = false;

  lang = inject(LangService);
  data: Subject<CaseAttachment[]> = new Subject<CaseAttachment[]>();
  dataSource: AppTableDataSource<CaseAttachment> =
    new AppTableDataSource<CaseAttachment>(this.data);

  displayedColumns: string[] = ['documentTitle'];
  constructor() {
    super();
  }
  ngOnInit(): void {
    this._load();
    this.reload$.next();
  }

  private _load() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return this.offenderId
            ? this.service.getApologyAttachments(this.offenderId)
            : of([]);
        }),
      )
      .subscribe(data => {
        this.data.next(data);
      });
  }
  Z;

  openAddDialog() {
    this.dialog
      .open(AddApologyAttachmentComponent, {
        data: {
          offenderId: this.offenderId,
        },
      })
      .afterClosed()
      .subscribe(() => {
        this.reload$.next();
      });
  }
}
