import { HttpClient, HttpContext } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  counters?: Common['counters'];

  constructor(
    private http: HttpClient,
    private urlService: UrlService,
  ) {}

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

  loadCounters(): Observable<Common> {
    return this._loadCounters().pipe(
      tap(counters => {
        this.counters = counters.counters;
      }),
    );
  }

  hasCounter(key: keyof Common['counters']): boolean {
    return !!(this.counters && this.counters[key] !== '0');
  }

  getCounter(key: keyof Common['counters']): string {
    return (this.counters && this.counters[key]) || '';
  }

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
