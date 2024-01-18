import { BaseModel } from '@abstracts/base-model';
import { PenaltyDecisionService } from '@services/penalty-decision.service';

export class PenaltyDecision extends BaseModel<
  PenaltyDecision,
  PenaltyDecisionService
> {
  override $$__service_name__$$ = 'PenaltyDecisionService';
  caseId!: string;
  offenderId!: number;
  signerId!: number;
  penaltyId!: number;
}
