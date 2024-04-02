import { CaseAttachment } from '@models/case-attachment';
import { PenaltyDecision } from '@models/penalty-decision';
import { InterceptModel } from 'cast-response';
import { DecisionMinutesInterceptor } from '@model-interceptors/decision-minutes-interceptor';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new DecisionMinutesInterceptor();
@InterceptModel({ send, receive })
export class DecisionMinutes extends CaseAttachment {
  offenderIds: number[] = [];
  concernedId!: number;
  penaltyDecisionInfo!: PenaltyDecision;
  generalStatus!: number;
  generalStatusInfo!: AdminResult;
}
