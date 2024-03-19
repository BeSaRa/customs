import { Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { CallRequest } from '@models/call-request';
import { Observable } from 'rxjs';
import { ApologyModel } from '@models/apology-model';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { CallRequestPopupComponent } from '@standalone/popups/call-request-popup/call-request-popup.component';
import { ComponentType } from '@angular/cdk/portal';
import { CaseAttachment } from '@models/case-attachment';

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
export class CallRequestService extends BaseCrudWithDialogService<
  CallRequestPopupComponent,
  CallRequest
> {
  serviceName = 'CallRequestService';

  protected override getDialogComponent(): ComponentType<CallRequestPopupComponent> {
    return CallRequestPopupComponent;
  }

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
  apology(payload: ApologyModel): Observable<CallRequest> {
    return this.http.put<CallRequest>(
      this.getUrlSegment() + `/admin/apology`,
      payload,
    );
  }

  addApologyAttachment(
    offenderId: number,
    content: File | undefined,
  ): Observable<unknown> {
    const formData = new FormData();
    content ? formData.append('content ', content) : null;
    return this.http.post(
      this.getUrlSegment() + `/admin/apology/${offenderId}/attachment`,
      formData,
    );
  }

  @CastResponse(() => CaseAttachment)
  getApologyAttachments(offenderId: number): Observable<CaseAttachment[]> {
    return this.http.get<CaseAttachment[]>(
      this.getUrlSegment() + `/offender/${offenderId}/contained-attachments`,
    );
  }
}
