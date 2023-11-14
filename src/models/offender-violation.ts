import { Violation } from '@models/violation';
import { Offender } from '@models/offender';
import { BaseModel } from '@abstracts/base-model';
import { OffenderViolationInterceptor } from '@model-interceptors/offender-violation-interceptor';
import { OffenderViolationService } from '@services/offender-violation.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new OffenderViolationInterceptor();

@InterceptModel({ send, receive })
export class OffenderViolation extends BaseModel<OffenderViolation, OffenderViolationService> {
  $$__service_name__$$ = 'OffenderViolationService';
  repeat!: number;
  isProved = true;
  caseId!: string;
  violationId!: number;
  offenderId!: number;
  violationInfo!: Violation;
  offenderInfo!: Offender;
}
