import { InterceptModel } from 'cast-response';
import { PenaltyDecisionInterceptor } from '@model-interceptors/penalty-decision-interceptor';
import { Offender } from '@models/offender';

const { send, receive } = new PenaltyDecisionInterceptor();

@InterceptModel({ send, receive })
export class PenaltyDecisionCriteria extends Offender {
  decisionSerial!: string;
  offenderType!: number;
  decisionDate!: string;
  buildForm(controls = false): object {
    const { offenderType, decisionSerial, decisionDate } = this;
    return {
      offenderType: controls ? [offenderType] : offenderType,
      decisionSerial: controls ? [decisionSerial] : decisionSerial,
      decisionDate: controls ? [decisionDate] : decisionDate,
    };
  }
}
