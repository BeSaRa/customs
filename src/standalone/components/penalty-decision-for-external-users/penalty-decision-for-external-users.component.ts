import { Component, inject, OnInit } from '@angular/core';
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
} from '@angular/material/table';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { AppTableDataSource } from '@models/app-table-data-source';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyDecision } from '@models/penalty-decision';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';

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
  data = new Subject<PenaltyDecision[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  grievance$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
  view$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();
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
        this.data.next(list.rs);
      });
  }
}
