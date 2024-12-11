import { BaseModel } from '@abstracts/base-model';
import { UserDelegationService } from '@services/user-delegation.service';
import { UserDelegationInterceptor } from '@model-interceptors/user-delegation-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new UserDelegationInterceptor();

@InterceptModel({ send, receive })
export class UserDelegation extends BaseModel<
  UserDelegation,
  UserDelegationService
> {
  $$__service_name__$$ = 'UserDelegationService';
  delegatorId!: number;
  delegateeId!: number;
  departmentId!: number;
  startDate!: string;
  endDate!: string;
  delegationVsId!: string;
  delegatorInfo!: AdminResult;
  delegateeInfo!: AdminResult;
  departmentInfo!: AdminResult;
  isDelegated!: boolean;

  buildForm(controls = false): object {
    const { startDate, endDate, delegateeId, departmentId, delegatorId } = this;
    return {
      startDate: controls ? [startDate, CustomValidators.required] : startDate,
      endDate: controls ? [endDate, CustomValidators.required] : endDate,
      delegateeId: controls
        ? [delegateeId, CustomValidators.required]
        : delegateeId,
      delegatorId: controls
        ? [delegatorId, CustomValidators.required]
        : delegatorId,
      departmentId: controls
        ? [departmentId, CustomValidators.required]
        : departmentId,
      status: 1,
    };
  }
}
