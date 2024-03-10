import { Component, effect, inject, input, OnInit } from '@angular/core';
import { InvestigationReportService } from '@services/investigation-report.service';
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
import { LangService } from '@services/lang.service';
import { MatTooltip } from '@angular/material/tooltip';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { SummonType } from '@enums/summon-type';
import { DatePipe, JsonPipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-investigation-records-table',
  standalone: true,
  imports: [
    MatTable,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    MatTooltip,
    DatePipe,
    JsonPipe,
    IconButtonComponent,
  ],
  templateUrl: './investigation-records-table.component.html',
  styleUrl: './investigation-records-table.component.scss',
})
export class InvestigationRecordsTableComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  investigationReportService = inject(InvestigationReportService);
  models: InvestigationReport[] = [];
  offender = input.required<Offender>();
  model = input.required<Investigation>();
  selected = input<Offender>();
  reload$ = new Subject<void>();
  selectedChange = effect(() => {
    if (this.selected() === this.offender()) {
      this.reload$.next();
    }
  });

  displayedColumns = ['date', 'creator', 'status', 'actions'];
  view$ = new Subject<InvestigationReport>();
  edit$ = new Subject<InvestigationReport>();

  assertType(item: unknown): InvestigationReport {
    return item as InvestigationReport;
  }

  ngOnInit(): void {
    this.listenToReload();
    this.listenToView();
    this.listenToEdit();
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return this.investigationReportService
            .load(undefined, {
              caseId: this.model().id,
              summonedType: SummonType.OFFENDER,
              summonedId: this.offender().id,
            })
            .pipe(ignoreErrors());
        }),
      )
      .subscribe(result => {
        this.models = result.rs;
      });
  }

  private listenToView() {
    this.view$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(report => {
          return report
            .openView({
              offender: this.offender(),
              caseId: this.model().id,
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  private listenToEdit() {
    this.edit$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(report => {
          return report
            .openEdit({
              offender: this.offender(),
              caseId: this.model().id,
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
}
