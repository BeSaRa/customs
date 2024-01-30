import { ModelInterceptorContract } from 'cast-response';
import { PenaltyDecision } from '@models/penalty-decision';
import { Penalty } from '@models/penalty';

export class PenaltyDecisionInterceptor
  implements ModelInterceptorContract<PenaltyDecision>
{
  send(model: Partial<PenaltyDecision>): Partial<PenaltyDecision> {
    delete model.penaltyInfo;
    return model;
  }

  receive(model: PenaltyDecision): PenaltyDecision {
    model.penaltyInfo = new Penalty().clone<Penalty>({
      ...model.penaltyInfo,
    });
    return model;
  }
}
