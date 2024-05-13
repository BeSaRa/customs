import { BaseModel } from '@abstracts/base-model';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegationInterceptor } from '@model-interceptors/manager-delegation-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from '@models/admin-result';

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

  buildForm(controls = false): object {
    const { startDate, endDate, delegatedPenaltiesList } = this;
    return {
      startDate,
      endDate,
      delegatedPenaltiesList: [delegatedPenaltiesList],
      delegated: this.delegatedInfo.getNames(),
      department: this.departmentInfo.getNames(),
      status: 1,
    };
  }

  getDelegatedPenaltiesNames() {
    return this.delegatedPenaltiesInfo.map(penalty => penalty.getNames());
  }
}
