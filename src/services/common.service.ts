import { HttpClient, HttpContext } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import {
  IS_IDLE,
  NO_ERROR_HANDLE,
  NO_LOADER_TOKEN,
} from '@http-contexts/tokens';
import { Common } from '@models/common';
import { InboxResult } from '@models/inbox-result';
import { InternalUser } from '@models/internal-user';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { Observable, of, Subscription, timer } from 'rxjs';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ConfigService } from './config.service';
import { EmployeeService } from './employee.service';
import { CounterContract } from '@constants/counter-contract';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private http = inject(HttpClient);
  private urlService = inject(UrlService);
  private configService = inject(ConfigService);
  private authService = inject(AuthService);
  private employeeService = inject(EmployeeService);

  private _counters = signal<CounterContract | undefined>(undefined);
  counters = computed(() => this._counters());

  private _poolingSubscribtion?: Subscription;

  constructor() {
    this._startPolling();
  }

  private _startPolling() {
    this._poolingSubscribtion = timer(
      0,
      this.configService.CONFIG.TIME_TO_RELOAD_USER_INBOX_COUNTERS * 1000,
    )
      .pipe(
        filter(
          () =>
            this.authService.isAuthenticated() &&
            !this.employeeService.isExternal(),
        ),
        switchMap(() => this.loadCounters()),
      )
      .subscribe();
  }

  _getURLSegment(): string {
    return this.urlService.URLS.COMMON;
  }

  @CastResponse(() => Common, {
    fallback: '$default',
    unwrap: 'rs',
  })
  private _loadCounters(): Observable<Common> {
    return this.http.get<Common>(this._getURLSegment() + '/counters', {
      context: new HttpContext()
        .set(NO_LOADER_TOKEN, true)
        .set(NO_ERROR_HANDLE, true)
        .set(IS_IDLE, true),
    });
  }

  loadCounters = () => {
    return this._loadCounters()
      .pipe(
        tap(counters => {
          this._counters.set(counters.counters);
        }),
      )
      .pipe(catchError(() => of(null)));
  };

  @CastResponse(() => InternalUser, {
    fallback: '$default',
    unwrap: 'rs',
  })
  loadAvailableEmployeesToAssign(
    departmentId: number,
    inboxResults: InboxResult[],
  ) {
    const _tasks = inboxResults.map(t => ({
      BD_CASE_TYPE: t.BD_CASE_TYPE,
      ONWER: t.OWNER,
      TKIID: t.TKIID,
    }));
    return this.http.post<InternalUser[]>(
      this._getURLSegment() + '/internal/assign-user',
      _tasks,
      {
        params: { departmentId },
      },
    );
  }
}
