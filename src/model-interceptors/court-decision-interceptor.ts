import { ModelInterceptorContract } from 'cast-response';
import { CourtDecision } from '@models/court-decision';

export class CourtDecisionInterceptor
  implements ModelInterceptorContract<CourtDecision>
{
  send(model: Partial<CourtDecision>): Partial<CourtDecision> {
    return model;
  }

  receive(model: CourtDecision): CourtDecision {
    return model;
  }
}
