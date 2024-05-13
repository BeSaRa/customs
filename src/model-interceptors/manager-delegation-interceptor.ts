import { ModelInterceptorContract } from 'cast-response';
import { ManagerDelegation } from '@models/manager-delegation';
import { AdminResult } from '@models/admin-result';

export class ManagerDelegationInterceptor
  implements ModelInterceptorContract<ManagerDelegation>
{
  send(model: Partial<ManagerDelegation>): Partial<ManagerDelegation> {
    delete model.statusInfo;
    delete model.delegatedInfo;
    delete model.typeInfo;
    return model;
  }

  receive(model: ManagerDelegation): ManagerDelegation {
    model.delegatedInfo = AdminResult.createInstance(model.delegatedInfo);
    model.typeInfo = AdminResult.createInstance(model.typeInfo);
    model.statusInfo = AdminResult.createInstance(model.statusInfo);
    model.departmentInfo = AdminResult.createInstance(model.departmentInfo);
    model.delegatedPenaltiesInfo = model.delegatedPenaltiesInfo.map(penalty => {
      return AdminResult.createInstance(penalty);
    });
    return model;
  }
}
