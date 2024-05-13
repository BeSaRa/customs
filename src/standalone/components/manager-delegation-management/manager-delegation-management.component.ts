import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
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
import { ReplaySubject, switchMap } from 'rxjs';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegated } from '@models/manager-delegated';

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
  ],
  templateUrl: './manager-delegation-management.component.html',
  styleUrl: './manager-delegation-management.component.scss',
})
export class ManagerDelegationManagementComponent implements OnInit {
  lang = inject(LangService);
  dataSource: MatTableDataSource<ManagerDelegated> = new MatTableDataSource();
  managerDelegationService = inject(ManagerDelegationService);
  reload$ = new ReplaySubject<void>(1);
  displayedColumns = [
    'arName',
    'enName',
    'domainName',
    'defaultDepartment',
    'isDelegated',
    'actions',
  ];

  ngOnInit() {
    this.listenToReload();
    this.reload$.next();
  }

  listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.managerDelegationService.loadManagers();
        }),
      )
      .subscribe((value: ManagerDelegated[]) => {
        this.dataSource.data = value;
      });
  }
}
