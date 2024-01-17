import { InvestigationService } from '@services/investigation.service';
import { Injectable, inject } from '@angular/core';
import { InboxResult } from '@models/inbox-result';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseCaseService } from '@abstracts/base-case.service';
import { CaseTypes } from '@enums/case-types';
import { UrlService } from './url.service';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { QueryResultSet } from '@models/query-result-set';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.items.*': () => InboxResult,
    },
  },
  $default: {
    model: () => InboxResult,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InboxService extends RegisterServiceMixin(class {}) {
  serviceName = 'InboxService';
  services: Map<number, unknown> = new Map<number, unknown>();
  urlService = inject(UrlService);
  private http = inject(HttpClient);
  private investigationService = inject(InvestigationService);

  constructor() {
    super();
    this.services.set(CaseTypes.INVESTIGATION, this.investigationService);
  }

  protected getModelClass(): Constructor<InboxResult> {
    return InboxResult;
  }

  protected getModelInstance(): InboxResult {
    return new InboxResult();
  }

  @CastResponse(() => QueryResultSet)
  private _loadUserInbox(options?: never): Observable<QueryResultSet> {
    return this.http.get<QueryResultSet>(this.urlService.URLS.USER_INBOX, {
      params: new HttpParams({ fromObject: options }),
    });
  }

  loadUserInbox(options?: unknown): Observable<QueryResultSet> {
    return this._loadUserInbox(options as never);
  }

  @CastResponse(() => QueryResultSet)
  private _loadTeamInbox(
    teamId: number,
    options?: unknown
  ): Observable<QueryResultSet> {
    return this.http.get<QueryResultSet>(
      this.urlService.URLS.TEAM_INBOX + '/' + teamId,
      {
        params: new HttpParams({
          fromObject: options as { [p: string]: string },
        }),
      }
    );
  }

  loadTeamInbox(teamId: number, options?: unknown): Observable<QueryResultSet> {
    return this._loadTeamInbox(teamId, options);
  }

  getService(serviceNumber: number): BaseCaseService<unknown> {
    if (!this.services.has(serviceNumber)) {
      console.log(
        'Service number ' + serviceNumber + ' not registered in InboxServices'
      );
    }
    return this.services.get(serviceNumber) as BaseCaseService<unknown>;
  }

  getServiceRoute(caseType: number): string {
    return this.getService(caseType).getMenuItem().path as string;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_INBOX;
  }
}
