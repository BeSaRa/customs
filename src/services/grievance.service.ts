import { Injectable } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { CastResponseContainer } from 'cast-response';
import { LangKeysContract } from '@contracts/lang-keys-contract';

import { Grievance } from '@models/grievance';
import { Observable } from 'rxjs';

@CastResponseContainer({
  $default: {
    model: () => Grievance,
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

  getCasesAsList(): Observable<Grievance[]> {
    return this.http.get<Grievance[]>(this.getUrlSegment() + '/cases');
  }
}
