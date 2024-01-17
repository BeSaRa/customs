import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InboxResult } from '@models/inbox-result';
import { BehaviorSubject, Subject, switchMap, takeUntil } from 'rxjs';
import { LangService } from '@services/lang.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { InboxService } from '@services/inbox.services';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { Router } from '@angular/router';
import { QueryResultSet } from '@models/query-result-set';
import { EmployeeService } from '@services/employee.service';
import { Team } from '@models/team';
import { FormControl } from '@angular/forms';

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
  employeeService = inject(EmployeeService);
  riskStatus: Lookup[] = this.lookupService.lookups.riskStatus;
  queryResultSet?: QueryResultSet;
  oldQueryResultSet?: QueryResultSet;

  reloadInbox$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);
  reload$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  filter$ = new BehaviorSubject<Partial<InboxResult>>({});
  view$: Subject<InboxResult> = new Subject<InboxResult>();
  teams: Team[] = this.employeeService.getEmployeeTeams();
  selectedTeamId = new FormControl(-1);
  length = 50;

  columnsWrapper: ColumnsWrapper<InboxResult> = new ColumnsWrapper(
    new NoneFilterColumn('BD_DRAFT_FULL_SERIAL'),
    new NoneFilterColumn('BD_SUBJECT'),
    new NoneFilterColumn('BD_CASE_TYPE'),
    new NoneFilterColumn('PI_CREATE'),
    new NoneFilterColumn('ACTIVATED'),
    new NoneFilterColumn('PI_DUE'),
    new NoneFilterColumn('BD_FROM_USER'),
    new SelectFilterColumn(
      'RISK_STATUS',
      this.riskStatus,
      'lookupKey',
      'getNames'
    ),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);

  actions: ContextMenuActionContract<InboxResult>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: () => {
        console.log('navigate to view the case');
      },
    },
  ];

  ngOnInit(): void {
    this.listenToReload(this.employeeService.getEmployeeTeams()[0].id);
    this.listenToSelectedTeamIdChange();
  }

  private listenToReload(teamId: number = -1) {
    this.reloadInbox$
      .pipe(
        switchMap(() => {
          return this.inboxService.loadTeamInbox(teamId);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((value: QueryResultSet) => {
        this.queryResultSet = value;
        this.oldQueryResultSet = { ...value };
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

  listenToSelectedTeamIdChange() {
    this.selectedTeamId.valueChanges.subscribe((value) => {
      this.listenToReload(value!);
    });
  }
}
