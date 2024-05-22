import { InterceptModel } from 'cast-response';
import { PenaltyDecisionInterceptor } from '@model-interceptors/penalty-decision-interceptor';
import { PenaltyDecision } from '@models/penalty-decision';

const { send, receive } = new PenaltyDecisionInterceptor();

@InterceptModel({ send, receive })
export class PenaltyDecisionCriteria extends PenaltyDecision {
  decisionSerial: string = '';
  offenderType!: number;
  date: string | Date = new Date();
  buildForm(controls = false): object {
    const { offenderType, decisionSerial, decisionType, date } = this;
    return {
      offenderType: controls ? [offenderType] : offenderType,
      decisionSerial: controls ? [decisionSerial] : decisionSerial,
      decisionType: controls ? [decisionType] : decisionType,
      date: controls ? [date] : date,
    };
  }
}
