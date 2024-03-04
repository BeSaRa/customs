import { BaseModel } from '@abstracts/base-model';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Penalty } from '@models/penalty';
import { InterceptModel } from 'cast-response';
import { PenaltyDecisionInterceptor } from '@model-interceptors/penalty-decision-interceptor';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new PenaltyDecisionInterceptor();

@InterceptModel({ send, receive })
export class PenaltyDecision extends BaseModel<
  PenaltyDecision,
  PenaltyDecisionService
> {
  override $$__service_name__$$ = 'PenaltyDecisionService';
  caseId!: string;
  offenderId!: number;
  signerId!: number;
  penaltyId!: number;
  tkiid?: string;
  signerInfo!: AdminResult;
  comment?: string;
  penaltyInfo!: Penalty;
}
