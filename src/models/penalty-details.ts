import { BaseModel } from '@abstracts/base-model';
import { PenaltyDetailsService } from '@services/penalty-details.service';
import { CustomValidators } from '@validators/custom-validators';
import { AdminResult } from './admin-result';

export class PenaltyDetails extends BaseModel<PenaltyDetails, PenaltyDetailsService> {
  $$__service_name__$$ = 'PenaltyDetailsService';
  penaltySigner!: number;
  offenderLevel!: number;
  legalRule!: number;
  legalRuleInfo!: AdminResult;
  offenderLevelInfo!: AdminResult;
  penaltySignerInfo!: AdminResult;

  buildForm(controls = false): object {
    const { penaltySigner, offenderLevel, legalRule } = this;
    return {
      penaltySigner: controls ? [penaltySigner, CustomValidators.required] : penaltySigner,
      offenderLevel: controls ? [offenderLevel, CustomValidators.required] : offenderLevel,
      legalRule: controls ? [legalRule] : legalRule,
    };
  }
}