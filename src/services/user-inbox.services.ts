import { InvestigationService } from '@services/investigation.service';
import { Injectable, inject } from '@angular/core';
import { UserInbox } from '@models/user-inbox';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseCaseService } from '@abstracts/base-case.service';
import { CaseTypes } from '@enums/case-types';
import { UrlService } from './url.service';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.items.*': () => UserInbox,
    },
  },
  $default: {
    model: () => UserInbox,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserInboxService extends RegisterServiceMixin(class {}) {
  serviceName = 'UserInboxService';
  services: Map<number, unknown> = new Map<number, unknown>();
  urlService = inject(UrlService);
  private http = inject(HttpClient);
  private investigationService = inject(InvestigationService);

  constructor() {
    super();
    this.services.set(CaseTypes.INVESTIGATION, this.investigationService);
  }
  protected getModelClass(): Constructor<UserInbox> {
    return UserInbox;
  }

  protected getModelInstance(): UserInbox {
    return new UserInbox();
  }

  @CastResponse(() => UserInbox, { unwrap: 'rs.items', fallback: '$default' })
  private _loadUserInbox(options?: unknown): Observable<UserInbox[]> {
    return this.http.get<UserInbox[]>(this.urlService.URLS.USER_INBOX, {
      params: new HttpParams({ fromObject: options as { [p: string]: string } }),
    });
  }

  loadUserInbox(options?: unknown): Observable<UserInbox[]> {
    return this._loadUserInbox(options);
  }

  getService(serviceNumber: number): BaseCaseService<any> {
    if (!this.services.has(serviceNumber)) {
      console.log('Service number ' + serviceNumber + ' not registered in InboxServices');
    }
    return this.services.get(serviceNumber) as BaseCaseService<any>;
  }

  getServiceRoute(caseType: number): string {
    return this.getService(caseType).getMenuItem().path as string;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_INBOX;
  }
}
