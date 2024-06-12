import { Injectable } from '@angular/core';
import { InvestigationService } from './investigation.service';
import { Investigation } from '@models/investigation';
import { Observable } from 'rxjs';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';
import { InvestigationSearchCriteria } from '@models/Investigation-search-criteria';

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

  @CastResponse(() => InvestigationSearchCriteria, {
    unwrap: 'rs',
    fallback: '$default',
  })
  search(
    criteria: Partial<InvestigationSearchCriteria>,
  ): Observable<Investigation[]> {
    return this.http.post<Investigation[]>(this.getUrlSegment(), criteria);
  }
}
