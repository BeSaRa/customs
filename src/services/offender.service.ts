import { Injectable } from '@angular/core';
import { Offender } from '@models/offender';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { HttpParams } from '@angular/common/http';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { OffenderTypes } from '@enums/offender-types';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Offender,
    },
  },
  $default: {
    model: () => Offender,
  },
})
@Injectable({
  providedIn: 'root',
})
export class OffenderService extends BaseCrudService<Offender> {
  serviceName = 'OffenderService';

  protected getModelClass(): Constructor<Offender> {
    return Offender;
  }

  protected getModelInstance(): Offender {
    return new Offender();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.OFFENDER;
  }

  isEmployee(model: MawaredEmployee | ClearingAgent): model is MawaredEmployee {
    return model.type === OffenderTypes.EMPLOYEE;
  }

  isAgent(model: MawaredEmployee | ClearingAgent): model is ClearingAgent {
    return model.type === OffenderTypes.BROKER;
  }
  @CastResponse()
  getAttachmentsCount(offenderIds: number[]) {
    return this.http.get<Offender[]>(
      this.getUrlSegment() + `/attachment/count`,
      {
        params: new HttpParams({
          fromObject: {
            offenderIds: offenderIds.join(', '),
          },
        }),
      },
    );
  }
}
