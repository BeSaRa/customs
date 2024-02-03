import { ModelInterceptorContract } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { PenaltyDetails } from '@models/penalty-details';
export class PenaltyDetailsInterceptor
  implements ModelInterceptorContract<PenaltyDetails>
{
  send(model: Partial<PenaltyDetails>): Partial<PenaltyDetails> {
    delete model.penaltySignerInfo;
    delete model.legalRuleInfo;
    delete model.offenderLevelInfo;
    return model;
  }

  receive(model: PenaltyDetails): PenaltyDetails {
    model.penaltySignerInfo = new AdminResult().clone<AdminResult>({
      ...model.penaltySignerInfo,
    });
    model.legalRuleInfo = new AdminResult().clone<AdminResult>({
      ...model.legalRuleInfo,
    });
    model.offenderLevelInfo = new AdminResult().clone<AdminResult>({
      ...model.offenderLevelInfo,
    });

    return model;
  }
}
