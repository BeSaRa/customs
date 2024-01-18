import { BaseModel } from '@abstracts/base-model';
import { OffenderService } from '@services/offender.service';
import { AdminResult } from '@models/admin-result';
import { InterceptModel } from 'cast-response';
import { OffenderInterceptor } from '@model-interceptors/offender-interceptor';
import { OffenderViolation } from './offender-violation';

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
  offenderInfo?: {
    updatedBy: 0;
    updatedOn: '2023-10-16T20:15:23.434Z';
    clientData: string;
    code: string;
    arName: string;
    enName: string;
    qid: string;
    type: number;
    status: number;
    statusDateModified: '2023-10-16T20:15:23.434Z';
    employeeDepartmentId: number;
    typeInfo: AdminResult;
    statusInfo: AdminResult;
    id: 0;
    jobTitleCode: string;
    email: string;
    phone: string;
    phoneNumber: string;
    address: string;
  };
  violations: OffenderViolation[] = [];
  offenderOUInfo?: AdminResult;
  customsViolationEffectInfo?: AdminResult;
  clearingAgencyInfo!: AdminResult;
  typeInfo!: AdminResult;
  penaltyInfo!: AdminResult;
  agencyInfo!: AdminResult;

  override getNames(): string {
    return (
      (this.offenderInfo &&
        (this.offenderInfo[
          (this.getLangService().getCurrent().code +
            'Name') as keyof typeof this.offenderInfo
        ] as unknown as string)) ||
      ''
    );
  }
}
