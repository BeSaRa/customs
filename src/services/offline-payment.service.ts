import { inject, Injectable } from '@angular/core';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Fine } from '@models/Fine';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { BlobModel } from '@models/blob-model';
import { DomSanitizer } from '@angular/platform-browser';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Fine,
    },
  },
  $default: {
    model: () => Fine,
  },
})
@Injectable({
  providedIn: 'root',
})
export class OfflinePaymentService extends BaseCrudService<Fine> {
  override serviceName: string = 'OfflinePaymentService';
  domSanitizer = inject(DomSanitizer);
  protected override getUrlSegment(): string {
    return this.urlService.URLS.OFFLINE_PAYMENT;
  }
  protected override getModelInstance(): Fine {
    return new Fine();
  }
  protected override getModelClass(): Constructor<Fine> {
    return Fine;
  }

  @CastResponse(() => Fine, { unwrap: 'rs', fallback: '$default' })
  fetch(criteria: Partial<Fine>): Observable<Fine[]> {
    return this.http.post<Fine[]>(this.getUrlSegment() + '/fetch', criteria);
  }

  downloadDocumentById(docId: number): Observable<BlobModel> {
    return this.http
      .get(this.getUrlSegment() + '/document/' + docId + '/download', {
        responseType: 'blob',
      })
      .pipe(
        map(blob => {
          return new BlobModel(blob, this.domSanitizer);
        }),
      );
  }

  @CastResponse(() => Fine, { unwrap: 'rs', fallback: '$default' })
  pay(payload: {
    penaltyDecisionNumber: string;
    transactionNumber: string;
    offenderId: number;
  }): Observable<Fine> {
    return this.http.post<Fine>(
      this.getUrlSegment() + '/pay',
      {},
      {
        params: new HttpParams({
          fromObject: payload,
        }),
      },
    );
  }
}
