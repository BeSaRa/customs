import { Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  MatTableDataSource,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { CourtDecision } from '@models/court-decision';
import { Pagination } from '@models/pagination';
import { CourtDecisionService } from '@services/court-decision.service';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { BehaviorSubject, of, switchMap, takeUntil } from 'rxjs';
import { ButtonComponent } from '../button/button.component';
import { IconButtonComponent } from '../icon-button/icon-button.component';

@Component({
  selector: 'app-court-decision-list',
  standalone: true,
  imports: [
    MatCell,
    MatPaginator,
    MatRow,
    MatRowDef,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderRow,
    MatCellDef,
    MatHeaderCell,
    MatColumnDef,
    MatHeaderCellDef,
    MatTable,
    MatSort,
    IconButtonComponent,
    MatTooltip,
    ButtonComponent,
  ],
  templateUrl: './court-decision-list.component.html',
  styleUrl: './court-decision-list.component.scss',
})
export class CourtDecisionListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  courtDecisionService = inject(CourtDecisionService);
  dialog = inject(DialogService);
  @Input() userId!: number | undefined;
  @ViewChild('paginator') paginator!: MatPaginator;

  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);

  dataSource: MatTableDataSource<CourtDecision> = new MatTableDataSource();
  courtDecisionDisplayedColumns = [
    'caseIdentifier',
    'investigationFullSerial',
    'caseStatus',
    'creator',
    'offenderInfo',
    'actions',
  ];

  ngOnInit() {
    this.listenToReload();
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() => {
          return of({ count: 0, rs: [] });
        }),
      )
      .subscribe((list: Pagination<CourtDecision[]>) => {
        this.dataSource.data = list.rs;
      });

    this.dataSource.paginator = this.paginator;
    this.paginator._intl.getRangeLabel = (
      page: number,
      pageSize: number,
      length: number,
    ) => {
      const start = page * pageSize + 1;
      const end = Math.min((page + 1) * pageSize, length);
      return `${start} - ${end} ${this.lang.map.of} ${length}`;
    };
  }
}
