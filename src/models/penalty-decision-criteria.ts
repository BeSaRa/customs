import { InterceptModel } from 'cast-response';
import { PenaltyDecisionInterceptor } from '@model-interceptors/penalty-decision-interceptor';
import { Offender } from '@models/offender';

const { send, receive } = new PenaltyDecisionInterceptor();

@InterceptModel({ send, receive })
export class PenaltyDecisionCriteria extends Offender {
  offenderType!: number;
  decisionDate!: string;
  buildForm(controls = false): object {
    const { offenderType, decisionType, decisionSerial, decisionDate } = this;
    return {
      offenderType: controls ? [offenderType] : offenderType,
      decisionSerial: controls ? [decisionSerial] : decisionSerial,
      decisionDate: controls ? [decisionDate] : decisionDate,
      decisionType: controls ? [decisionType] : decisionType,
    };
  }
}
