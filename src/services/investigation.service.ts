import { Injectable } from '@angular/core';
import { BaseCaseService } from '@abstracts/base-case.service';
import { Constructor } from '@app-types/constructors';
import { ServiceContract } from '@contracts/service-contract';
import { Investigation } from '@models/investigation';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => Investigation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InvestigationService extends BaseCaseService<Investigation> implements ServiceContract {
  serviceName = 'InvestigationService';

  getUrlSegment(): string {
    return this.urlService.URLS.INVESTIGATION;
  }

  getModelInstance(): Investigation {
    return new Investigation();
  }

  getModelClass(): Constructor<Investigation> {
    return Investigation;
  }
}
