import { BaseModel } from '@abstracts/base-model';
import { OffenderService } from '@services/offender.service';
import { AdminResult } from '@models/admin-result';
import { InterceptModel } from 'cast-response';
import { OffenderInterceptor } from '@model-interceptors/offender-interceptor';
import { OffenderViolation } from './offender-violation';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';

const { send, receive } = new OffenderInterceptor();

@InterceptModel({ send, receive })
export class Offender extends BaseModel<Offender, OffenderService> {
  $$__service_name__$$ = 'OffenderService';
  caseId!: string;
  offenderRefId!: number;
  type!: number;
  clearingAgencyId!: number;
  customsViolationEffect!: number;
  penaltyId!: number;
  linkedPid!: number;
  statusDateModified?: Date | string;
  ouId!: number;
  agentCustomCode!: string;
  attachmentCount: number = 0;
  offenderInfo?: MawaredEmployee | ClearingAgent;
  violations: OffenderViolation[] = [];
  offenderOUInfo?: AdminResult;
  customsViolationEffectInfo?: AdminResult;
  clearingAgencyInfo!: AdminResult;
  typeInfo!: AdminResult;
  penaltyInfo!: AdminResult;
  agencyInfo!: AdminResult;

  override getNames(): string {
    return this.offenderInfo?.getNames() || '';
  }
}
