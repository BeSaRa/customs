import { BaseModel } from '@abstracts/base-model';
import { InterceptModel } from 'cast-response';
import { ObligationToAttendService } from '@services/obligation-to-attend.service';
import { ObligationToAttendInterceptor } from '@model-interceptors/obligation-to-attend-interceptor';
import { AdminResult } from '@models/admin-result';
import { PersonDetails } from '@models/person-details';

const { receive } = new ObligationToAttendInterceptor();

@InterceptModel({ receive })
export class ObligationToAttend extends BaseModel<
  ObligationToAttend,
  ObligationToAttendService
> {
  $$__service_name__$$ = 'ObligationToAttendService';
  caseId!: string;
  type!: string;
  summonedId!: number;
  summonedType!: number;
  summonDate!: string;
  summonTime!: string;
  summons!: string;
  summonsPlace!: string;
  note!: string;
  createdBy!: number;
  isApologize!: boolean;
  apologyReason!: string;
  apologyReasonId!: number;
  apologyReasonDate!: string;
  apologyReasonInfo!: AdminResult;
  statusDateModified!: AdminResult;
  typeInfo!: AdminResult;
  summonInfo!: PersonDetails;
  summonTypeInfo!: AdminResult;
}
