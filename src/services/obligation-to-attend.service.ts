import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { ObligationToAttend } from '@models/obligation-to-attend';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ObligationToAttend,
    },
  },
  $default: {
    model: () => ObligationToAttend,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ObligationToAttendService extends BaseCrudService<ObligationToAttend> {
  serviceName = 'ObligationToAttendService';
  protected getModelClass(): Constructor<ObligationToAttend> {
    return ObligationToAttend;
  }

  protected getModelInstance(): ObligationToAttend {
    return new ObligationToAttend();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.OBLIGATION_TO_ATTEND;
  }
}
