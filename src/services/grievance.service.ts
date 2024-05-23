import { Injectable } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { LangKeysContract } from '@contracts/lang-keys-contract';

import { Grievance } from '@models/grievance';
import { Observable } from 'rxjs';
import { Pagination } from '@models/pagination';
import { HttpParams } from '@angular/common/http';

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
  getCasesAsList(
    userId: number,
    applicantType: number,
  ): Observable<Pagination<Grievance[]>> {
    return this.http.post<Pagination<Grievance[]>>(
      this.getUrlSegment() + `/cases/${userId}/applicant/${applicantType}`,
      {},
    );
  }

  addComment(payload: { comment: string; caseId: string }) {
    return this.http.post(
      this.getUrlSegment() + '/comment',
      {},
      {
        params: new HttpParams({
          fromObject: payload,
        }),
      },
    );
  }
}
