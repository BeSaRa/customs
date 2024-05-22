import { Injectable } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { LangKeysContract } from '@contracts/lang-keys-contract';

import { Grievance } from '@models/grievance';
import { Observable } from 'rxjs';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $default: {
    model: () => Grievance,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Grievance,
    },
  },
})
@Injectable({
  providedIn: 'root',
})
export class GrievanceService
  extends BaseCaseService<Grievance>
  implements ServiceContract
{
  serviceKey: keyof LangKeysContract = 'menu_grievances';
  serviceName = 'GrievanceService';

  getUrlSegment(): string {
    return this.urlService.URLS.GRIEVANCE;
  }

  getModelInstance(): Grievance {
    return new Grievance();
  }

  getModelClass(): Constructor<Grievance> {
    return Grievance;
  }

  @CastResponse(undefined, {
    fallback: '$pagination',
  })
  getCasesAsList(): Observable<Pagination<Grievance[]>> {
    return this.http.get<Pagination<Grievance[]>>(
      this.getUrlSegment() + '/cases',
    );
  }
}
