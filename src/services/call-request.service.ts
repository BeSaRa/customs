import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { CallRequest } from '@models/call-request';
import { Observable } from 'rxjs';
import { ApologyModel } from '@models/apology-model';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => CallRequest,
    },
  },
  $default: {
    model: () => CallRequest,
  },
})
@Injectable({
  providedIn: 'root',
})
export class CallRequestService extends BaseCrudService<CallRequest> {
  serviceName = 'CallRequestService';
  protected getModelClass(): Constructor<CallRequest> {
    return CallRequest;
  }

  protected getModelInstance(): CallRequest {
    return new CallRequest();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.CALL_REQUEST;
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '$pagination',
  })
  @CastResponse(undefined, {
    unwrap: 'rs',
    fallback: '$default',
  })
  apology(id: number, payload: ApologyModel): Observable<CallRequest> {
    return this.http.put<CallRequest>(
      this.getUrlSegment() + `/admin/${id}/apology`,
      payload,
    );
  }
}
