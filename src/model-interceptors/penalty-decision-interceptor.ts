import { ModelInterceptorContract } from 'cast-response';
import { PenaltyDecision } from '@models/penalty-decision';
import { Penalty } from '@models/penalty';
import { AdminResult } from '@models/admin-result';

export class PenaltyDecisionInterceptor
  implements ModelInterceptorContract<PenaltyDecision>
{
  send(model: Partial<PenaltyDecision>): Partial<PenaltyDecision> {
    delete model.penaltyInfo;
    delete model.signerInfo;
    delete model.statusInfo;
    delete model.id;
    return model;
  }

  receive(model: PenaltyDecision): PenaltyDecision {
    model.penaltyInfo = new Penalty().clone<Penalty>({
      ...model.penaltyInfo,
    });
    model.signerInfo = new AdminResult().clone<AdminResult>({
      ...model.signerInfo,
    });
    model.statusInfo = new AdminResult().clone<AdminResult>({
      ...model.statusInfo,
    });
    return model;
  }
}
