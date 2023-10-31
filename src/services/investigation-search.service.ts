import { Injectable } from '@angular/core';
import { InvestigationService } from './investigation.service';
import { Investigation } from '@models/investigation';
import { Observable } from 'rxjs';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';

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

  @CastResponse(() => Investigation, { unwrap: 'rs', fallback: '$default' })
  search(criteria: Partial<Investigation>): Observable<Investigation[]> {
    return this.http.post<Investigation[]>(this.getUrlSegment() + '/search', criteria);
  }
}
