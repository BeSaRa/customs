import { InterceptModel } from 'cast-response';
import { PenaltyDecisionInterceptor } from '@model-interceptors/penalty-decision-interceptor';
import { Offender } from '@models/offender';

const { send, receive } = new PenaltyDecisionInterceptor();

@InterceptModel({ send, receive })
export class PenaltyDecisionCriteria extends Offender {
  offenderType!: number;
  decisionDate: string | Date = new Date();
  buildForm(controls = false): object {
    const { offenderType, penaltyId, decisionSerial, decisionDate } = this;
    return {
      offenderType: controls ? [offenderType] : offenderType,
      decisionSerial: controls ? [decisionSerial] : decisionSerial,
      decisionDate: controls ? [decisionDate] : decisionDate,
      penaltyId: controls ? [penaltyId] : penaltyId,
    };
  }
}
