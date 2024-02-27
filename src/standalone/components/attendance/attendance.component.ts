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
import { CallRequestService } from '@services/call-request.service';
import { CallRequest } from '@models/call-request';
import { DatePipe } from '@angular/common';
import { ApologyPopupComponent } from '@standalone/popups/apology-popup/apology-popup.component';

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
  callRequestService = inject(CallRequestService);
  data = new Subject<CallRequest[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  apology$: Subject<CallRequest> = new Subject<CallRequest>();
  displayedColumns = [
    'fileNumber',
    'summonDateTime',
    'summons',
    'summonsPlace',
    'actions',
  ];

  ngOnInit(): void {
    this.listenToReload();
    this._listenToApology();
  }

  private listenToReload() {
    this.reload$
      .pipe(switchMap(() => this.callRequestService.loadExternal()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data.next(list.rs);
      });
  }
  private _listenToApology() {
    this.apology$
      .pipe(
        switchMap((model: CallRequest) => {
          return this.dialog
            .open(ApologyPopupComponent, {
              data: {
                model,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(data => {
        console.log(data);
      });
  }
}
