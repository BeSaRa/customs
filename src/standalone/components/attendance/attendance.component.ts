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
import { MatSort } from '@angular/material/sort';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { AppTableDataSource } from '@models/app-table-data-source';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatTooltip } from '@angular/material/tooltip';
import { ObligationToAttendService } from '@services/obligation-to-attend.service';
import { ObligationToAttend } from '@models/obligation-to-attend';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-attendance',
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
    MatRow,
    MatHeaderRow,
    MatNoDataRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    DatePipe,
  ],
  templateUrl: './attendance.component.html',
  styleUrl: './attendance.component.scss',
})
export class AttendanceComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  assignmentToAttendService = inject(ObligationToAttendService);
  data = new Subject<ObligationToAttend[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  displayedColumns = ['summonDate', 'summons', 'summonsPlace', 'actions'];

  ngOnInit(): void {
    this.listenToReload();
  }

  private listenToReload() {
    this.reload$
      .pipe(
        switchMap(() =>
          this.assignmentToAttendService.load(undefined, {
            summonedId: this.employeeService.getLoginData()?.person.id,
          }),
        ),
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data.next(list.rs);
      });
  }
}
