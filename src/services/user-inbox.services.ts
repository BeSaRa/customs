import { Injectable } from '@angular/core';
import { UserInbox } from '@models/user-inbox';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

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
export class UserInboxService extends BaseCrudService<UserInbox> {
  serviceName = 'GlobalSettingService';

  protected getModelClass(): Constructor<UserInbox> {
    return UserInbox;
  }

  protected getModelInstance(): UserInbox {
    return new UserInbox();
  }

  @CastResponse(() => UserInbox, { unwrap: 'rs.items', fallback: '$default' })
  private _loadUserInbox(options?: unknown): Observable<UserInbox[]> {
    return this.http.get<UserInbox[]>(this.urlService.URLS.USER_INBOX, {
      params: new HttpParams({ fromObject: options as { [p: string]: string | number | boolean | readonly (string | number | boolean)[] } }),
    });
  }

  loadUserInbox(options?: unknown): Observable<UserInbox[]> {
    return this._loadUserInbox(options);
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_INBOX;
  }
}
