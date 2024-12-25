import { BaseModel } from '@abstracts/base-model';
import { UserDelegationService } from '@services/user-delegation.service';
import { UserDelegationInterceptor } from '@model-interceptors/user-delegation-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { Observable } from 'rxjs';
import { UserDelegationType } from '@enums/user-delegation-type';

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

  // not related to model
  delegationType!: UserDelegationType;

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

  override save(): Observable<UserDelegation> {
    if (this.delegationType === UserDelegationType.PREFERENCES) {
      return this.id
        ? this.$$getService$$<UserDelegationService>().updatePreferencesFull(
            this,
          )
        : this.$$getService$$<UserDelegationService>().createPreferencesFull(
            this,
          );
    }

    return super.save();
  }
}
