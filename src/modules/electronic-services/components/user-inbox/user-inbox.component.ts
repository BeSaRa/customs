import { Component, inject, OnInit } from '@angular/core';
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
import { InboxRiskStatus } from '@enums/inbox-risk-status';
import { CaseTypes } from '@enums/case-types';

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
  riskStatus: Lookup[] = this.lookupService.lookups.riskStatus;
  queryResultSet?: QueryResultSet;
  oldQueryResultSet?: QueryResultSet;

  reloadInbox$: BehaviorSubject<unknown> = new BehaviorSubject<unknown>(null);
  reload$: BehaviorSubject<void> = new BehaviorSubject<void>(undefined);
  filter$ = new BehaviorSubject<Partial<InboxResult>>({});
  view$: Subject<InboxResult> = new Subject<InboxResult>();

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

  private listenToReload() {
    this.reloadInbox$
      .pipe(
        switchMap(() => {
          // if (!this.hasFilterCriteria()) {
          return this.inboxService.loadUserInbox();
          // } else {
          //   return this.inboxService.loadUserInbox(this.filterCriteria);
          // }
        }),
        takeUntil(this.destroy$),
      )
      .subscribe((value: QueryResultSet) => {
        this.queryResultSet = value;
        this.oldQueryResultSet = { ...value };
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
  statusStyle(element: InboxResult) {
    let classes = 'custom-status ';
    if (element.RISK_STATUS === InboxRiskStatus.NORMAL) {
      classes += 'custom-status-normal';
    } else if (element.RISK_STATUS === InboxRiskStatus.AT_RISK) {
      classes += 'custom-status-risk';
    } else if (element.RISK_STATUS === InboxRiskStatus.OVERDUE) {
      classes += 'custom-status-overdue';
    }
    return classes;
  }
}
