import { Component, OnInit, ViewChildren, inject } from '@angular/core';
import { UserInbox } from '@models/user-inbox';
import { FormArray, FormControl, FormGroup, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  BehaviorSubject,
  Observable,
  switchMap,
  takeUntil,
  Subject,
  isObservable,
  of,
  filter,
  exhaustMap,
  catchError,
  throwError,
  finalize,
  tap,
  ReplaySubject,
  delay,
  combineLatest,
  map,
} from 'rxjs';
import { CustomValidators } from '@validators/custom-validators';
import { FileType } from '@models/file-type';
import { LangService } from '@services/lang.service';
import { ToastService } from '@services/toast.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ignoreErrors } from '@utils/utils';
import { UserInboxService } from '@services/user-inbox.services';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { TextFilterColumn } from '@models/text-filter-column';
import { SelectFilterColumn } from '@models/select-filter-column';
import { MatTableDataSource } from '@angular/material/table';
import { AppTableDataSource } from '@models/app-table-data-source';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-user-inbox',
  templateUrl: './user-inbox.component.html',
  styleUrls: ['./user-inbox.component.scss'],
})
export class UserInboxComponent extends OnDestroyMixin(class {}) implements OnInit {
  inboxService = inject(UserInboxService);
  lookupService = inject(LookupService);
  lang = inject(LangService);

  riskStatus: Lookup[] = this.lookupService.lookups.riskStatus;

  reloadInbox$: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  reload$ = new ReplaySubject<void>(1);
  data$: Observable<UserInbox[]> = this._load();
  filter$ = new BehaviorSubject<Partial<UserInbox>>({});
  view$: Subject<UserInbox> = new Subject<UserInbox>();
  private loadingSubject = new BehaviorSubject<boolean>(true);
  public loading$ = this.loadingSubject.asObservable();

  dataSource: AppTableDataSource<UserInbox> = new AppTableDataSource<UserInbox>(this.data$);
  length = 50;

  columnsWrapper: ColumnsWrapper<UserInbox> = new ColumnsWrapper(
    new NoneFilterColumn('BD_FULL_SERIAL'),
    new NoneFilterColumn('BD_SUBJECT'),
    new NoneFilterColumn('BD_CASE_TYPE'),
    new NoneFilterColumn('PI_CREATE'),
    new NoneFilterColumn('ACTIVATED'),
    new NoneFilterColumn('PI_DUE'),
    new NoneFilterColumn('BD_FROM_USER'),
    new SelectFilterColumn('RISK_STATUS', this.riskStatus, 'lookupKey', 'getNames'),
    new NoneFilterColumn('actions')
  ).attacheFilter(this.filter$);

  actions: ContextMenuActionContract<UserInbox>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        console.log('navigate to view the case');
      },
    },
  ];

  protected _load(): Observable<UserInbox[]> {
    return of(undefined)
      .pipe(delay(0))
      .pipe(
        switchMap(() => {
          return combineLatest([this.reload$, this.filter$]).pipe(
            switchMap(([, filter]) => {
              this.loadingSubject.next(true);
              return (
                filter.RISK_STATUS != null
                  ? this.inboxService.loadUserInbox().pipe(map(msgs => msgs.filter(msg => msg.RISK_STATUS === filter.RISK_STATUS)))
                  : this.inboxService.loadUserInbox()
              ).pipe(
                finalize(() => this.loadingSubject.next(false)),
                ignoreErrors()
              );
            }),
            tap(response => {
              this.length = response.length;
              this.loadingSubject.next(false);
            })
          );
        })
      );
  }

  ngOnInit(): void {
    this.reload$.next();
  }

  filterChange($event: { key: string; value: string | null }) {
    if ($event.value === null || $event.value === undefined || $event.value === '') {
      delete this.filter$.value[$event.key as keyof UserInbox];
      this.filter$.next({ ...this.filter$.value });
      return;
    }
    this.filter$.next({
      ...this.filter$.value,
      [$event.key]: $event.value,
    });
  }
}
