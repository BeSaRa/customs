import { Violation } from '@models/violation';
import { Offender } from '@models/offender';
import { BaseModel } from '@abstracts/base-model';
import { OffenderViolationInterceptor } from '@model-interceptors/offender-violation-interceptor';
import { OffenderViolationService } from '@services/offender-violation.service';
import { InterceptModel } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { ProofTypes } from '@enums/proof-types';

const { send, receive } = new OffenderViolationInterceptor();

@InterceptModel({ send, receive })
export class OffenderViolation extends BaseModel<
  OffenderViolation,
  OffenderViolationService
> {
  $$__service_name__$$ = 'OffenderViolationService';
  repeat: number = 0;
  caseId!: string;
  violationId!: number;
  offenderId!: number;
  offenderRefId!: number;
  violationInfo!: Violation;
  offenderInfo!: Offender;
  proofStatus: ProofTypes = ProofTypes.UNDEFINED;
  proofStatusInfo!: AdminResult;

  isNormalDate(): boolean {
    return !!this.violationInfo.violationsDate;
  }
}
