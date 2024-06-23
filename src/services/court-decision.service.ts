import { BaseCaseService } from '@abstracts/base-case.service';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { CourtDecision } from '@models/court-decision';
import { Pagination } from '@models/pagination';
import { CastResponseContainer } from 'cast-response';
@CastResponseContainer({
  $default: {
    model: () => CourtDecision,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => CourtDecision,
    },
  },
})
@Injectable({
  providedIn: 'root',
})
export class CourtDecisionService extends BaseCaseService<CourtDecision> {
  serviceKey: keyof LangKeysContract = 'menu_court_decisions';
  serviceName = 'CourtDecisionService';

  getUrlSegment(): string {
    return this.urlService.URLS.COURT_DECISION;
  }

  getModelInstance(): CourtDecision {
    return new CourtDecision();
  }

  getModelClass(): Constructor<CourtDecision> {
    return CourtDecision;
  }
}
