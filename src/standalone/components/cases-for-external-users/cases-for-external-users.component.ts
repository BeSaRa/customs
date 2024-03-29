import { Component, inject, OnInit, ViewChild } from '@angular/core';
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
  MatTableDataSource,
} from '@angular/material/table';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { EmployeeService } from '@services/employee.service';
import { filter, Subject, switchMap, takeUntil } from 'rxjs';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { OffenderService } from '@services/offender.service';
import { InvestigationForExternalUser } from '@models/investigation-for-external-user';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { UserTypes } from '@enums/user-types';

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
    MatPaginator,
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
  route = inject(ActivatedRoute);
  dataSource: MatTableDataSource<InvestigationForExternalUser> =
    new MatTableDataSource();
  reload$: Subject<null> = new Subject<null>();
  view$: Subject<InvestigationForExternalUser> =
    new Subject<InvestigationForExternalUser>();
  displayedColumns = ['fileNumber', 'dateCreated', 'status', 'actions'];
  @ViewChild('paginator') paginator!: MatPaginator;
  userId!: number | undefined;

  ngOnInit(): void {
    this.listenToReload();
    this.route.queryParams.subscribe(params => {
      this.userId = params.id;
      this.reload$.next(null);
    });
  }

  private listenToReload() {
    this.reload$
      .pipe(
        filter(
          () =>
            UserTypes.EXTERNAL_CLEARING_AGENCY !==
              this.employeeService.getLoginData()?.type || !!this.userId,
        ),
      )
      .pipe(
        switchMap(() =>
          UserTypes.EXTERNAL_CLEARING_AGENCY ===
          this.employeeService.getLoginData()?.type
            ? this.offenderService.loadCasesForExternal({
                offenderId: this.userId as number,
              })
            : this.offenderService.loadCasesForExternal(),
        ),
      )
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
}
