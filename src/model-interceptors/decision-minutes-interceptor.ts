import { ModelInterceptorContract } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { DecisionMinutes } from '@models/decision-minutes';
import { PenaltyDecisionInterceptor } from '@model-interceptors/penalty-decision-interceptor';
import { PenaltyDecision } from '@models/penalty-decision';

const penaltyDecisionInterceptor = new PenaltyDecisionInterceptor();
export class DecisionMinutesInterceptor
  implements ModelInterceptorContract<DecisionMinutes>
{
  send(model: Partial<DecisionMinutes>): Partial<DecisionMinutes> {
    delete model.attachmentTypeInfo;
    delete model.creatorInfo;
    delete model.ouInfo;
    delete model.generalStatusInfo;

    return model;
  }

  receive(model: DecisionMinutes): DecisionMinutes {
    model.creatorInfo &&
      (model.creatorInfo = AdminResult.createInstance(model.creatorInfo));
    model.ouInfo && (model.ouInfo = AdminResult.createInstance(model.ouInfo));

    model.penaltyDecisionInfo = new PenaltyDecision().clone<PenaltyDecision>(
      penaltyDecisionInterceptor.receive(model.penaltyDecisionInfo),
    );
    model.generalStatusInfo &&
      (model.generalStatusInfo = AdminResult.createInstance(
        model.generalStatusInfo,
      ));
    return model;
  }
}
