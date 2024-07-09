import { Injectable } from '@angular/core';
import { Investigation } from '@models/investigation';
import { Pagination } from '@models/pagination';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { InvestigationService } from './investigation.service';
import { Observable } from 'rxjs';

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
export class InvestigationDraftsService extends InvestigationService {
  override serviceName: string = 'InvestigationDraftsService';

  @CastResponse(undefined, { unwrap: '', fallback: '$pagination' })
  search(criteria: {
    pageNumber: number;
    pageSize: number;
  }): Observable<Pagination<Investigation[]>> {
    return this.http.post<Pagination<Investigation[]>>(
      this.getUrlSegment() + '/is-drafted/search',
      criteria,
    );
  }
}
