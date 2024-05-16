import { BaseModel } from '@abstracts/base-model';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegationInterceptor } from '@model-interceptors/manager-delegation-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new ManagerDelegationInterceptor();

@InterceptModel({ send, receive })
export class ManagerDelegation extends BaseModel<
  ManagerDelegation,
  ManagerDelegationService
> {
  $$__service_name__$$ = 'ManagerDelegationService';

  type!: number;
  delegatedId!: number;
  departmentId!: number;
  startDate!: string;
  endDate!: string;
  delegatedPenalties!: string;
  delegationVsId!: string;
  delegatedPenaltiesList!: number[];
  delegatedPenaltiesInfo!: AdminResult[];
  delegatedInfo!: AdminResult;
  typeInfo!: AdminResult;
  departmentInfo!: AdminResult;
  isDelegated!: boolean;

  buildForm(controls = false): object {
    const {
      startDate,
      endDate,
      delegatedPenaltiesList,
      delegatedId,
      departmentId,
    } = this;
    return {
      startDate: controls ? [startDate, CustomValidators.required] : startDate,
      endDate: controls ? [endDate, CustomValidators.required] : endDate,
      delegatedPenaltiesList: controls
        ? [delegatedPenaltiesList, CustomValidators.required]
        : delegatedPenaltiesList,
      delegatedId: controls
        ? [delegatedId, CustomValidators.required]
        : delegatedId,
      departmentId: controls
        ? [departmentId, CustomValidators.required]
        : departmentId,
      status: 1,
    };
  }
}
