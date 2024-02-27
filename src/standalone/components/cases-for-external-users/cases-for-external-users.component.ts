import { Component, inject, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
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
import { MatTooltip } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { OffenderService } from '@services/offender.service';
import { AppTableDataSource } from '@models/app-table-data-source';
import { InvestigationForExternalUser } from '@models/investigation-for-external-user';

@Component({
  selector: 'app-cases-for-external-users',
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
  templateUrl: './cases-for-external-users.component.html',
  styleUrl: './cases-for-external-users.component.scss',
})
export class CasesForExternalUsersComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  offenderService = inject(OffenderService);
  data = new Subject<InvestigationForExternalUser[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  view$: Subject<InvestigationForExternalUser> =
    new Subject<InvestigationForExternalUser>();
  displayedColumns = ['fileNumber', 'dateCreated', 'status', 'actions'];

  ngOnInit(): void {
    this.listenToReload();
  }

  private listenToReload() {
    this.reload$
      .pipe(switchMap(() => this.offenderService.loadCasesForExternal()))
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data.next(list.rs);
      });
  }
}
