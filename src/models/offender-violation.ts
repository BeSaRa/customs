import { BaseModel } from '@abstracts/base-model';
import { OffenderViolationService } from '@services/offender-violation.service';

export class OffenderViolation extends BaseModel<OffenderViolation, OffenderViolationService> {
  $$__service_name__$$ = 'OffenderViolationService';
  repeat!: number;
  isProved = true;
  caseId!: string;
  violationId!: number;
  offenderId!: number;
}
