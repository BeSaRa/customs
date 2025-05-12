import { Component, computed, inject, OnInit } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { LangService } from '@services/lang.service';
import { DatePipe } from '@angular/common';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { InvestigationReport } from '@models/investigation-report';
import { MatTooltip } from '@angular/material/tooltip';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { map, switchMap, takeUntil } from 'rxjs/operators';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { Subject } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ignoreErrors } from '@utils/utils';
import { InvestigationService } from '@services/investigation.service';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { DialogService } from '@services/dialog.service';
import { Config } from '@constants/config';
import { InvestigationReportService } from '@services/investigation-report.service';

@Component({
  selector: 'app-related-investigation-records-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    DatePipe,
    MatCell,
    MatTable,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCellDef,
    MatNoDataRow,
    MatTooltip,
  ],
  templateUrl: './related-investigation-records-popup.component.html',
  styleUrl: './related-investigation-records-popup.component.scss',
})
export class RelatedInvestigationRecordsPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  dialog = inject(DialogService);
  investigationService = inject(InvestigationService);
  investigationReportService = inject(InvestigationReportService);
  view$ = new Subject<InvestigationReport>();
  load$ = new Subject<void>();
  models!: InvestigationReport[];
  data: CrudDialogDataContract<Investigation> = inject(MAT_DIALOG_DATA);
  displayedColumns = ['creator', 'createdDate', 'actions'];
  protected readonly Config = Config;

  person = this.data.extras?.person;
  recordId = this.data.extras?.recordId as string;

  isOffender = computed(() => {
    const person = this.person;
    return person instanceof Offender;
  });
  ngOnInit(): void {
    this.listenToLoad();
    this.listenToView();
    this.load$.next();
  }

  assertType(item: unknown): InvestigationReport {
    return item as InvestigationReport;
  }

  private listenToLoad() {
    this.load$
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() =>
          this.investigationService
            .loadInvestigationReportVersions(this.recordId)
            .pipe(ignoreErrors()),
        ),
        map(result => result.filter(item => item.isApproved)),
      )
      .subscribe(filtered => {
        this.models = filtered;
      });
  }
  listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(report => {
          return this.investigationService.downloadDocumentById(report.id).pipe(
            map(blob => {
              return {
                report,
                blob,
              };
            }),
          );
        }),
        map(({ blob }) => {
          return this.dialog.open(ViewAttachmentPopupComponent, {
            disableClose: true,
            data: {
              model: blob,
              title: this.lang.map.preview_related_documents,
            },
          });
        }),
      )
      .subscribe();
  }
}
