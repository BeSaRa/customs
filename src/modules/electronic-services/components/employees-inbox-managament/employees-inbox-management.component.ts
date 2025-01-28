import { SelectionModel } from '@angular/cdk/collections';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AppIcons } from '@constants/app-icons';
import { Config } from '@constants/config';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { CaseTypes } from '@enums/case-types';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { InboxResult } from '@models/inbox-result';
import { InternalUser } from '@models/internal-user';
import { QueryResultSet } from '@models/query-result-set';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InboxService } from '@services/inbox.services';
import { InternalUserService } from '@services/internal-user.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { NavbarService } from '@services/navbar.service';
import { ReassignTaskPopupComponent } from '@standalone/popups/reassign-task-popup/reassign-task-popup.component';
import { ignoreErrors } from '@utils/utils';
import { filter, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employees-inbox-management',
  templateUrl: './employees-inbox-management.component.html',
  styleUrl: './employees-inbox-management.component.scss',
})
export class EmployeesInboxManagementComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  @ViewChild('paginator') paginator!: MatPaginator;

  internalUserService = inject(InternalUserService);
  employeeService = inject(EmployeeService);
  lookupService = inject(LookupService);
  inboxService = inject(InboxService);
  lang = inject(LangService);
  dialog = inject(DialogService);
  navbarService = inject(NavbarService);

  departments =
    this.employeeService
      .getLoginData()
      ?.organizationUnits.filter(ou => ou.id !== -1) ?? [];
  employees: InternalUser[] = [];

  ouControl = new FormControl<number | null>(
    this.employeeService.getLoginData()?.organizationUnit.id!,
  );
  employeeControl = new FormControl<InternalUser | null>(null);

  queryResultSet?: QueryResultSet;
  dataSource: MatTableDataSource<InboxResult> =
    new MatTableDataSource<InboxResult>([]);

  columns = [
    'select',
    'SERIAL',
    'BD_SUBJECT',
    'BD_TYPE',
    'ACTIVATED',
    'PI_DUE',
    'TAD_DISPLAY_NAME',
    'BD_FROM_USER',
    'RISK_STATUS',
    'actions',
  ];

  actions: ContextMenuActionContract<InboxResult>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'assign_to_employee',
      icon: AppIcons.ACCOUNT_CONVERT,
      callback: element => this.openReassignPopup([element]),
    },
  ];

  length = 50;
  readonly caseTypes = CaseTypes;
  readonly Config = Config;

  selection = new SelectionModel<InboxResult>(true, []);

  ngOnInit(): void {
    this.listenToDepartmentChange();
    this.listenToOuChange();
    this.listenToEmployeeChange();
    this.ouControl.disable(); // until implementing super admin from BE side
  }

  assertType(item: InboxResult): InboxResult {
    return item;
  }

  listenToDepartmentChange() {
    this.navbarService.departmentChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.ouControl.setValue(
          this.employeeService.getLoginData()?.organizationUnit.id!,
        );
      });
  }

  listenToOuChange() {
    this.ouControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(ouId => {
        this.loadEmployees();
      });
  }

  listenToEmployeeChange() {
    this.employeeControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadEmployeeInbox();
      });
  }

  loadEmployees() {
    if (!this.ouControl.value) return;
    this.selection.clear();
    this.internalUserService
      .loadUsersByOuIdAdmin(this.ouControl.value!, false)
      .pipe(ignoreErrors())
      .subscribe(emps => {
        this.employees = emps;
      });
  }

  loadEmployeeInbox() {
    this.selection.clear();
    const employeeDomainName = this.employeeControl.value?.domainName;
    if (!employeeDomainName) {
      this.dataSource.data = [];
      return;
    }
    this.inboxService
      .loadUserInboxByDomain(employeeDomainName)
      .subscribe((value: QueryResultSet) => {
        this.queryResultSet = value;
        this.dataSource.data = this.queryResultSet.items;
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

  isAllSelected() {
    return this.selection.selected.length === this.dataSource.data.length;
  }

  toggleAllRows() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
  }

  openReassignPopup(tasks: InboxResult[]): void {
    const ouId = this.ouControl.value!;
    const currentEmployeeId = this.employeeControl.value?.id;

    this.internalUserService
      .loadUsersByOuIdAdmin(ouId)
      .pipe(ignoreErrors())
      .subscribe(employees => {
        const availableEmployees = employees.filter(
          emp => emp.id !== currentEmployeeId,
        );

        const dialogRef = this.dialog.open(ReassignTaskPopupComponent, {
          data: {
            tasks,
            employees: availableEmployees,
          },
        });

        dialogRef
          .afterClosed()
          .pipe(
            take(1),
            filter(response => response === UserClick.YES),
          )
          .subscribe(() => this.loadEmployeeInbox());
      });
  }
}
