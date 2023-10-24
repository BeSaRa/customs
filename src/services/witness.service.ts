import { Injectable } from '@angular/core';
import { CastResponseContainer } from 'cast-response';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Witness } from '@models/witness';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Witness,
    },
  },
  $default: {
    model: () => Witness,
  },
})
@Injectable({
  providedIn: 'root',
})
export class WitnessService extends BaseCrudService<Witness> {
  serviceName = 'WitnessService';

  protected getModelClass(): Constructor<Witness> {
    return Witness;
  }

  protected getModelInstance(): Witness {
    return new Witness();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.WITNESS;
  }
}
