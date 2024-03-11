import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Meeting } from '@models/meeting';
import { BaseCrudService } from '@abstracts/base-crud-service';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Meeting,
    },
  },
  $default: {
    model: () => Meeting,
  },
})
@Injectable({
  providedIn: 'root',
})
export class MeetingService extends BaseCrudService<Meeting> {
  serviceName = 'MeetingService';

  protected getModelClass(): Constructor<Meeting> {
    return Meeting;
  }

  protected getModelInstance(): Meeting {
    return new Meeting();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.MEETING;
  }
}
