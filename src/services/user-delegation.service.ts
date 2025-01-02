import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { SortOptionsContract } from '@contracts/sort-options-contract';
import { UserDelegationType } from '@enums/user-delegation-type';
import { Pagination } from '@models/pagination';
import { UserDelegation } from '@models/user-delegation';
import { UserDelegationPopupComponent } from '@modules/administration/popups/user-delegation-popup/user-delegation-popup.component';
import {
  CastResponse,
  CastResponseContainer,
  HasInterception,
  InterceptParam,
} from 'cast-response';
import { map, Observable } from 'rxjs';
import { BlobModel } from '@models/blob-model';
import { DomSanitizer } from '@angular/platform-browser';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => UserDelegation,
    },
  },
  $default: {
    model: () => UserDelegation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserDelegationService extends BaseCrudWithDialogService<
  UserDelegationPopupComponent,
  UserDelegation
> {
  serviceName = 'UserDelegationService';
  domSanitizer = inject(DomSanitizer);

  protected getModelClass(): Constructor<UserDelegation> {
    return UserDelegation;
  }

  protected getModelInstance(): UserDelegation {
    return new UserDelegation();
  }

  getDialogComponent(): ComponentType<UserDelegationPopupComponent> {
    return UserDelegationPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_DELEGATION;
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '$pagination',
  })
  override load(
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
    criteria?: Partial<UserDelegation>,
    sortOptions?: SortOptionsContract,
  ) {
    const _url =
      this.getUrlSegment() +
      (criteria?.delegationType === UserDelegationType.PREFERENCES
        ? 'preferences'
        : '');
    this._cleanCriteria(criteria);
    const _params =
      criteria?.delegationType === UserDelegationType.PREFERENCES
        ? undefined
        : new HttpParams({
            fromObject: { ...options, ...criteria, ...sortOptions } as any,
          });
    return this.http.get<Pagination<UserDelegation[]>>(_url, {
      params: _params,
    });
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '$pagination',
  })
  override loadComposite(
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
    criteria?: Partial<UserDelegation>,
    sortOptions?: SortOptionsContract,
  ) {
    const _url =
      this.getUrlSegment() +
      (criteria?.delegationType === UserDelegationType.PREFERENCES
        ? '/preferences'
        : '/composite');
    this._cleanCriteria(criteria);
    const _params =
      criteria?.delegationType === UserDelegationType.PREFERENCES
        ? undefined
        : new HttpParams({
            fromObject: { ...options, ...criteria, ...sortOptions } as any,
          });
    return this.http.get<Pagination<UserDelegation[]>>(_url, {
      params: _params,
    });
  }

  @HasInterception
  @CastResponse()
  updatePreferencesFull(@InterceptParam() model: UserDelegation) {
    return this.http.put<UserDelegation>(
      this.getUrlSegment() + '/preferences/full',
      model,
    );
  }

  @HasInterception
  @CastResponse()
  createPreferencesFull(@InterceptParam() model: UserDelegation) {
    return this.http.post<UserDelegation>(
      this.getUrlSegment() + '/preferences/full',
      model,
    );
  }

  getFileAttachments(delegationVsId: string): Observable<BlobModel> {
    return this.http
      .get(`/investigation-case/document/latest/${delegationVsId}/content`, {
        responseType: 'blob',
      })
      .pipe(map(blob => new BlobModel(blob, this.domSanitizer)));
  }
}
