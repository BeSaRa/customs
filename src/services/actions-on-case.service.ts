import { Injectable, inject } from '@angular/core';
import { ActionsOnCase } from '@models/actions-on-case';
import { Pagination } from '@models/pagination';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { UrlService } from './url.service';
import { HttpClient } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ActionsOnCase,
    },
  },
  $default: {
    model: () => ActionsOnCase,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ActionsOnCaseService {
  serviceName = 'ActionsOnCaseService';
  urlService: UrlService = inject(UrlService);
  http: HttpClient = inject(HttpClient);

  getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION;
  }

  @CastResponse(() => ActionsOnCase, { unwrap: 'rs', fallback: '$default' })
  ActionsOnCase(criteria: { caseId: string }) {
    return this.http.get<ActionsOnCase[]>(
      `${this.getUrlSegment()}/${criteria.caseId}/actions`,
    );
  }
}
