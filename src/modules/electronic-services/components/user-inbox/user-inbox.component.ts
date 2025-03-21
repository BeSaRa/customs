import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppIcons } from '@constants/app-icons';
import { Config } from '@constants/config';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { ActivitiesName } from '@enums/activities-name';
import { CaseTypes } from '@enums/case-types';
import { StepsName } from '@enums/steps-name';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { InboxResult } from '@models/inbox-result';
import { Lookup } from '@models/lookup';
import { NoneFilterColumn } from '@models/none-filter-column';
import { QueryResultSet } from '@models/query-result-set';
import { SelectFilterColumn } from '@models/select-filter-column';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { InboxService } from '@services/inbox.services';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { BehaviorSubject, switchMap, takeUntil } from 'rxjs';
import { ActionsOnCaseComponent } from '../actions-on-case/actions-on-case.component';

@Component({
  selector: 'app-user-inbox',
  templateUrl: './user-inbox.component.html',
  styleUrls: ['./user-inbox.component.scss'],
})
export class UserInboxComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  inboxService = inject(InboxService);
  lookupService = inject(LookupService);
  lang = inject(LangService);
  router = inject(Router);
  dialog = inject(DialogService);

  riskStatus: Lookup[] = this.lookupService.lookups.riskStatus;
  queryResultSet?: QueryResultSet;
  oldQueryResultSet?: QueryResultSet;
  employeeService = inject(EmployeeService);

  reloadInbox$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);
  filter$ = new BehaviorSubject<Partial<InboxResult>>({});
  dataSource: MatTableDataSource<InboxResult> = new MatTableDataSource();
  @ViewChild('paginator') paginator!: MatPaginator;
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

  ngOnInit(): void {
    this.listenToReload();
  }

  listenToReload() {
    this.reloadInbox$
      .pipe(
        switchMap(() => {
          return this.inboxService.loadUserInbox();
        }),
        takeUntil(this.destroy$),
      )
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

  assertType(item: InboxResult): InboxResult {
    return item;
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

  showActionsOnCase(item: InboxResult) {
    this.dialog.open(ActionsOnCaseComponent, {
      data: { caseId: item.PI_PARENT_CASE_ID },
    });
  }

  protected readonly CaseTypes = CaseTypes;
  readonly Config = Config;

  getStepName(element: InboxResult): string {
    const stepMappings: Record<string, string> = {
      [StepsName.DEPARTMENT_STATEMENT_REVIEW]: this.lang.map.outgoing,
      [StepsName.STATEMENT_DEST_DEPARTMENT]: this.lang.map.incoming,
      [StepsName.STATEMENT_OWNER_REVIEW]: this.lang.map.outgoing,
      [StepsName.DEPARTMENT_REPLY]: this.lang.map.reply,
      [StepsName.GRIEVANCE_OWNER_REVIEW]: this.lang.map.outgoing,
      [StepsName.GRIEVANCE_DEPARTMENT_REVIEW]: this.lang.map.outgoing,
      [StepsName.GRIEVANCE_STATEMENT_REVIEW]: this.lang.map.incoming,
      [StepsName.GRIEVANCE_REPLY]: this.lang.map.reply,
    };

    return stepMappings[element.NAME] || this.lang.map.unknown;
  }

  isStatement(element: InboxResult) {
    return (
      element.PT_NAME === ActivitiesName.REVIEW_DEPARTMENT_STATEMENT ||
      element.PT_NAME === ActivitiesName.REVIEW_GRIEVANCE_STATEMENT
    );
  }
}
