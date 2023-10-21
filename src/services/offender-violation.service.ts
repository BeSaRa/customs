import { Injectable } from '@angular/core';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { OffenderViolation } from '@models/offender-violation';
import { Constructor } from '@app-types/constructors';
import { CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: { 'rs.*': () => OffenderViolation },
  },
  $default: {
    model: () => OffenderViolation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class OffenderViolationService extends BaseCrudService<OffenderViolation> {
  serviceName = 'OffenderViolationService';

  protected getUrlSegment(): string {
    return this.urlService.URLS.OFFENDER_VIOLATION;
  }

  protected getModelInstance(): OffenderViolation {
    return new OffenderViolation();
  }

  protected getModelClass(): Constructor<OffenderViolation> {
    return OffenderViolation;
  }
}
