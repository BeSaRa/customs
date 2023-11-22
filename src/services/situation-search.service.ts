import { BaseCrudService } from '@abstracts/base-crud-service';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { OffenderTypes } from '@enums/offender-types';
import { Pagination } from '@models/pagination';
import { SituationSearch } from '@models/situation-search';
import { CastResponse, CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.items.*': () => SituationSearch,
    },
  },
  $default: {
    model: () => SituationSearch,
  },
})
@Injectable({
  providedIn: 'root',
})
export class SituationSearchService extends BaseCrudService<SituationSearch> {
  serviceName = 'SituationSearchService';

  protected getModelClass(): Constructor<SituationSearch> {
    return SituationSearch;
  }

  protected getModelInstance(): SituationSearch {
    return new SituationSearch();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.SITUATION_SEARCH;
  }

  @CastResponse(() => SituationSearch, { unwrap: 'rs', fallback: '$default' })
  loadSituation(offenderId: number, type: number, isCompany: boolean) {
    let path = '';
    if (type === OffenderTypes.EMPLOYEE) {
      path = '/employee/departments';
    } else if (type === OffenderTypes.BROKER) {
      path = isCompany ? '/brokerage-company' : '/broker';
    }
    return this.http.get<SituationSearch[]>(this.getUrlSegment() + path, {
      params: new HttpParams({ fromObject: { offenderId } }),
    });
  }
}
