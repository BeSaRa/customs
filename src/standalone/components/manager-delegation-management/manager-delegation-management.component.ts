import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { AsyncPipe, DatePipe } from '@angular/common';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
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
import { MatCheckbox } from '@angular/material/checkbox';
import { MatPaginator } from '@angular/material/paginator';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { LangService } from '@services/lang.service';
import { MatTooltip } from '@angular/material/tooltip';
import { ReplaySubject, Subject, switchMap } from 'rxjs';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegation } from '@models/manager-delegation';
import { ConfigService } from '@services/config.service';
import { InternalUser } from '@models/internal-user';

@Component({
  selector: 'app-manager-delegation-management',
  standalone: true,
  imports: [
    AsyncPipe,
    ContextMenuComponent,
    FilterColumnComponent,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatCheckbox,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatPaginator,
    MatProgressSpinner,
    MatRow,
    MatRowDef,
    MatSort,
    MatSortHeader,
    MatTable,
    MatTooltip,
    MatHeaderCellDef,
    MatNoDataRow,
    DatePipe,
  ],
  templateUrl: './manager-delegation-management.component.html',
  styleUrl: './manager-delegation-management.component.scss',
})
export class ManagerDelegationManagementComponent implements OnInit {
  lang = inject(LangService);
  config = inject(ConfigService);
  dataSource: MatTableDataSource<InternalUser> = new MatTableDataSource();
  managerDelegationService = inject(ManagerDelegationService);
  reload$ = new ReplaySubject<void>(1);
  @Output() reload = new EventEmitter<void>();

  delegateManager$ = new Subject<InternalUser>();
  cancelDelegate$ = new Subject<InternalUser>();
  displayedColumns = [
    'name',
    'domainName',
    'defaultDepartment',
    'isDelegated',
    'delegationDates',
    'actions',
  ];

  ngOnInit() {
    this.listenToReload();
    this.listenToDelegateManager();
    this.listenToCancelDelegate();
    this.reload$.next();
  }

  listenToDelegateManager() {
    this.delegateManager$.subscribe(user => {
      user.managerDelegation.isDelegated
        ? this.managerDelegationService
            .openEditDialog(new ManagerDelegation(), {
              delegatedId: user.id,
              departmentId: user.defaultDepartmentInfo.id,
              startDate: user.managerDelegation.startDate,
              endDate: user.managerDelegation.endDate,
              penalties: user.managerDelegation.delegatedPenaltiesList,
            })
            .afterClosed()
            .subscribe(() => this.reload$.next())
        : this.managerDelegationService
            .openCreateDialog(new ManagerDelegation(), {
              delegatedId: user.id,
              departmentId: user.defaultDepartmentInfo.id,
            })
            .afterClosed()
            .subscribe(() => this.reload$.next());
    });
  }

  listenToCancelDelegate() {
    this.cancelDelegate$.subscribe(user => {
      this.managerDelegationService
        .cancelDelegated(user.id)
        .subscribe(() => this.reload$.next());
    });
  }

  listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.managerDelegationService.loadManagers();
        }),
      )
      .subscribe((value: InternalUser[]) => {
        this.dataSource.data = value;
        this.reload.emit();
      });
  }
}
