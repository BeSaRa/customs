import { Injectable, inject } from '@angular/core';
import { AssignedTo } from '@models/assigned-to';
import { UrlService } from './url.service';
import { HttpClient } from '@angular/common/http';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Pagination } from '@models/pagination';
@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => AssignedTo,
    },
  },
  $default: {
    model: () => AssignedTo,
  },
})
@Injectable({
  providedIn: 'root',
})
export class AssignedToService {
  serviceName = 'AssignedToService';
  urlService: UrlService = inject(UrlService);
  http: HttpClient = inject(HttpClient);

  getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION;
  }

  @CastResponse(() => AssignedTo, { unwrap: 'rs', fallback: '$default' })
  assignedTo(criteria: { caseId: string }) {
    return this.http.get<AssignedTo[]>(
      `${this.getUrlSegment()}/${criteria.caseId}/assigned-to`,
    );
  }
}
