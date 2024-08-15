import { Component, inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppIcons } from '@constants/app-icons';
import { Config } from '@constants/config';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { CaseTypes } from '@enums/case-types';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { InboxResult } from '@models/inbox-result';
import { Lookup } from '@models/lookup';
import { NoneFilterColumn } from '@models/none-filter-column';
import { QueryResultSet } from '@models/query-result-set';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Team } from '@models/team';
import { CommonService } from '@services/common.service';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InboxService } from '@services/inbox.services';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { NavbarService } from '@services/navbar.service';
import { BehaviorSubject, switchMap, takeUntil, tap } from 'rxjs';
import { ActionsOnCaseComponent } from '../actions-on-case/actions-on-case.component';

@Component({
  selector: 'app-team-inbox',
  templateUrl: './team-inbox.component.html',
  styleUrls: ['./team-inbox.component.scss'],
})
export class TeamInboxComponent
  extends OnDestroyMixin(class {})
  implements OnInit, OnDestroy
{
  inboxService = inject(InboxService);
  lookupService = inject(LookupService);
  lang = inject(LangService);
  router = inject(Router);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  commonService = inject(CommonService);
  navbarService = inject(NavbarService);
  riskStatus: Lookup[] = this.lookupService.lookups.riskStatus;
  queryResultSet?: QueryResultSet;
  oldQueryResultSet?: QueryResultSet;
  dataSource: MatTableDataSource<InboxResult> = new MatTableDataSource();
  @ViewChild('paginator') paginator!: MatPaginator;

  reloadInbox$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);
  filter$ = new BehaviorSubject<Partial<InboxResult>>({});
  teams: Team[] = this.employeeService.getEmployeeTeams();
  selectedTeamId = new FormControl(-1);
  length = 50;
  caseTypes = CaseTypes;
  columnsWrapper: ColumnsWrapper<InboxResult> = new ColumnsWrapper(
    new NoneFilterColumn('SERIAL'),
    new NoneFilterColumn('BD_SUBJECT'),
    new NoneFilterColumn('BD_TYPE'),
    new NoneFilterColumn('ACTIVATED'),
    new NoneFilterColumn('PI_DUE'),
    new NoneFilterColumn('TAD_DISPLAY_NAME'),
    new NoneFilterColumn('BD_FROM_USER'),
    new SelectFilterColumn(
      'RISK_STATUS',
      this.riskStatus,
      'lookupKey',
      'getNames',
    ),
    new NoneFilterColumn('actions'),
  ).attacheFilter(this.filter$);

  actions: ContextMenuActionContract<InboxResult>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: element => {
        this.view(element);
      },
    },
  ];

  readonly Config = Config;

  ngOnInit(): void {
    this.listenToReload(this.employeeService.getEmployeeTeams()[0].id);
    this.listenToSelectedTeamIdChange();
    this.listenToDepartmentChange();
  }

  override ngOnDestroy() {
    this.navbarService.departmentChange$.unsubscribe();
  }

  listenToReload(teamId: number = -1) {
    this.reloadInbox$
      .pipe(
        switchMap(() => {
          return this.inboxService.loadTeamInbox(teamId);
        }),
        takeUntil(this.destroy$),
      )
      .pipe(tap(() => this.commonService.loadCounters().subscribe()))
      .subscribe((value: QueryResultSet) => {
        this.queryResultSet = value;
        this.oldQueryResultSet = { ...value };
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

  filterChange($event: { key: string; value: string | null }) {
    if (
      $event.value === null ||
      $event.value === undefined ||
      $event.value === ''
    ) {
      delete this.filter$.value[$event.key as keyof InboxResult];
      this.filter$.next({ ...this.filter$.value });
      return;
    }
    this.filter$.next({
      ...this.filter$.value,
      [$event.key]: $event.value,
    });
  }

  view(item: InboxResult) {
    this.router
      .navigate([item.itemRoute], { queryParams: { item: item.itemDetails } })
      .then();
  }

  assertType(item: InboxResult): InboxResult {
    return item;
  }

  listenToSelectedTeamIdChange() {
    this.selectedTeamId.valueChanges.subscribe(value => {
      this.listenToReload(value!);
    });
  }

  showActionsOnCase(item: InboxResult) {
    this.dialog.open(ActionsOnCaseComponent, {
      data: { caseId: item.PI_PARENT_CASE_ID },
    });
  }

  listenToDepartmentChange() {
    this.navbarService.departmentChange$.subscribe(() => this.listenToReload());
  }

  protected readonly CaseTypes = CaseTypes;
}
