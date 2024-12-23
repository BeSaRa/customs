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
import { Team } from '@models/team';
import { CommonService } from '@services/common.service';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InboxService } from '@services/inbox.services';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { TeamService } from '@services/team.service';
import { ReassignTaskPopupComponent } from '@standalone/popups/reassign-task-popup/reassign-task-popup.component';
import { ignoreErrors } from '@utils/utils';
import { filter, take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-employees-inbox-managment',
  templateUrl: './employees-inbox-managment.component.html',
  styleUrl: './employees-inbox-managment.component.scss',
})
export class EmployeesInboxManagmentComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  @ViewChild('paginator') paginator!: MatPaginator;

  teamService = inject(TeamService);
  employeeService = inject(EmployeeService);
  lookupService = inject(LookupService);
  inboxService = inject(InboxService);
  commonService = inject(CommonService);
  lang = inject(LangService);
  dialog = inject(DialogService);

  departments =
    this.employeeService
      .getLoginData()
      ?.organizationUnits.filter(ou => ou.id !== -1) ?? [];
  teams: Team[] = [];
  employees: InternalUser[] = [];
  availableEmployeesToAssign: InternalUser[] = [];

  ouControl = new FormControl<number | null>(
    this.employeeService.getLoginData()?.organizationUnit.id!,
  );
  teamControl = new FormControl<number | null>(null);
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

  riskStatus = this.lookupService.lookups.riskStatus;

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
    this.listenToOuChange();
    this.listenToTeamChange();
    this.listenToEmployeeChange();
    this.ouControl.disable(); // until implementing super admin from BE side
  }

  assertType(item: InboxResult): InboxResult {
    return item;
  }

  listenToOuChange() {
    this.ouControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(ouId => {
        this.teamControl.setValue(null);
        this.loadTeams();
      });
  }

  listenToTeamChange() {
    this.teamControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(tId => {
        this.employeeControl.setValue(null);
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

  loadTeams() {
    this.selection.clear();
    this.teamService
      .loadDepartmentTeams(this.ouControl.value!)
      .pipe(ignoreErrors())
      .subscribe(teams => (this.teams = teams));
  }

  loadEmployees() {
    if (!this.teamControl.value) return;
    this.selection.clear();
    this.teamService
      .loadTeamMembersById(this.teamControl.value!, this.ouControl.value!)
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

  openReassignPopup(tasks: InboxResult[]) {
    this.dialog
      .open(ReassignTaskPopupComponent, {
        data: {
          tasks,
          employees: this.employees.filter(
            e => e.id !== this.employeeControl.value?.id,
          ),
        },
      })
      .afterClosed()
      .pipe(
        take(1),
        filter(res => res === UserClick.YES),
      )
      .subscribe(() => this.loadEmployeeInbox());
  }
}
