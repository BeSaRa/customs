import { ModelInterceptorContract } from 'cast-response';
import { UserDelegation } from '@models/user-delegation';
import { AdminResult } from '@models/admin-result';

export class UserDelegationInterceptor
  implements ModelInterceptorContract<UserDelegation>
{
  send(model: Partial<UserDelegation>): Partial<UserDelegation> {
    delete model.delegateeInfo;
    delete model.delegatorInfo;
    delete model.departmentInfo;
    delete model.statusInfo;
    delete model.delegationType;
    return model;
  }

  receive(model: UserDelegation): UserDelegation {
    model.delegateeInfo = AdminResult.createInstance(model.delegateeInfo);
    model.delegatorInfo = AdminResult.createInstance(model.delegatorInfo);
    model.departmentInfo = AdminResult.createInstance(model.departmentInfo);
    model.statusInfo = AdminResult.createInstance(model.statusInfo);

    return model;
  }
}
