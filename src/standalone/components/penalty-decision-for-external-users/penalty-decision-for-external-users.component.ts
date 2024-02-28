import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
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
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyDecision } from '@models/penalty-decision';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { UserTypes } from '@enums/user-types';

@Component({
  selector: 'app-penalty-decision-for-external-users',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatSort,
    MatTable,
    MatTooltip,
    MatHeaderRow,
    MatRow,
    MatNoDataRow,
    MatHeaderRowDef,
    MatHeaderCellDef,
    MatRowDef,
    DatePipe,
    MatPaginator,
  ],
  templateUrl: './penalty-decision-for-external-users.component.html',
  styleUrl: './penalty-decision-for-external-users.component.scss',
})
export class PenaltyDecisionForExternalUsersComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  dataSource: MatTableDataSource<PenaltyDecision> = new MatTableDataSource();
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  grievance$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  view$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  pay$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  protected readonly userTypes = UserTypes;
  @ViewChild('paginator') paginator!: MatPaginator;
  displayedColumns = [
    'decisionSerial',
    'decisionDate',
    'status',
    'signer',
    'penalty',
    'actions',
  ];

  ngOnInit(): void {
    this.listenToReload();
  }

  private listenToReload() {
    this.reload$
      .pipe(switchMap(() => this.penaltyDecisionService.loadExternal()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.dataSource.data = list.rs;
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
      });
  }

  protected readonly UserTypes = UserTypes;
}
