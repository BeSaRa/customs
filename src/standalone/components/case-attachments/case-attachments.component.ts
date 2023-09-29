import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { AppTableDataSource } from '@models/app-table-data-source';
import { CaseAttachment } from '@models/case-attachment';
import { combineLatest, delay, exhaustMap, Observable, of, ReplaySubject, Subject, switchMap, takeUntil } from 'rxjs';
import { BaseCaseService } from '@abstracts/base-case.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-case-attachments',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSortModule, MatTableModule, MatCardModule],
  templateUrl: './case-attachments.component.html',
  styleUrls: ['./case-attachments.component.scss'],
})
export class CaseAttachmentsComponent extends OnDestroyMixin(class {}) implements OnInit {
  view$ = new Subject<CaseAttachment>();
  reload$ = new ReplaySubject<void>(1);
  @Input()
  caseId?: string;
  @Input()
  disabled = false;
  @Input()
  title?: string;
  @Input()
  service!: BaseCaseService<unknown>;

  lang = inject(LangService);

  dataSource: AppTableDataSource<CaseAttachment> = new AppTableDataSource<CaseAttachment>(this._load());

  displayedColumns: string[] = ['documentTitle', 'attachmentType', 'actions'];

  ngOnInit(): void {
    if (this.caseId) this.reload$.next();

    this.listenToView();
  }

  private _load(): Observable<CaseAttachment[]> {
    return of(undefined)
      .pipe(delay(0))
      .pipe(
        switchMap(() => {
          console.log('LOAD');
          return combineLatest([this.reload$]).pipe(
            switchMap(() => {
              return this.caseId ? this.service.loadFolderAttachments(this.caseId) : of([]);
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
    if (!this.caseId) {
      return;
    }
    this.service
      .openAddAttachmentDialog(this.caseId, this.service)
      .afterClosed()
      .subscribe(() => {
        this.reload$.next();
      });
  }

  private listenToView() {
    //investigation-case/document/{docId}/download
    this.view$
      .pipe(
        exhaustMap(item => {
          return item.view(this.service);
        })
      )
      .subscribe(() => {
        console.log('VIEW');
      });
  }
}
