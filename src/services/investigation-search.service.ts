import { Injectable } from '@angular/core';
import { InvestigationService } from './investigation.service';
import { Investigation } from '@models/investigation';
import { Observable } from 'rxjs';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Investigation,
    },
  },
  $default: {
    model: () => Investigation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InvestigationSearchService extends InvestigationService {
  override serviceName: string = 'InvestigationSearchService';

  override getUrlSegment(): string {
    return this.urlService.URLS.CASE_ENTITY_VIEW;
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '$pagination',
  })
  search(criteria: {
    [key: string]: string | number | boolean;
  }): Observable<Pagination<Investigation[]>> {
    if (criteria) {
      Object.keys(criteria as unknown as object).forEach(key => {
        if (
          criteria &&
          (criteria[key] === null || criteria[key] === undefined)
        ) {
          delete criteria[key];
        }
      });
    }
    return this.http.get<Pagination<Investigation[]>>(this.getUrlSegment(), {
      params: new HttpParams({ fromObject: criteria }),
    });
  }
}
