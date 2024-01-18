import { ModelInterceptorContract } from 'cast-response';
import { ViolationPenalty } from '@models/violation-penalty';
import { AdminResult } from '@models/admin-result';

export class ViolationPenaltyInterceptor
  implements ModelInterceptorContract<ViolationPenalty>
{
  send(model: Partial<ViolationPenalty>): Partial<ViolationPenalty> {
    return model;
  }

  receive(model: ViolationPenalty): ViolationPenalty {
    model.violationTypeInfo = new AdminResult().clone(model.violationTypeInfo);
    model.offenderLevelInfo = new AdminResult().clone(model.offenderLevelInfo);
    model.penaltyInfo = new AdminResult().clone(model.penaltyInfo);
    model.penaltySignerInfo = new AdminResult().clone(model.penaltySignerInfo);
    model.penaltyGuidanceInfo = new AdminResult().clone(
      model.penaltyGuidanceInfo,
    );
    model.offenderLevelInfo = new AdminResult().clone(model.offenderLevelInfo);
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.offenderTypeInfo = new AdminResult().clone(model.offenderTypeInfo);
    return model;
  }
}
