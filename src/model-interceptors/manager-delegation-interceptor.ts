import { ModelInterceptorContract } from 'cast-response';
import { ManagerDelegation } from '@models/manager-delegation';

export class ManagerDelegationInterceptor
  implements ModelInterceptorContract<ManagerDelegation>
{
  send(model: Partial<ManagerDelegation>): Partial<ManagerDelegation> {
    return model;
  }

  receive(model: ManagerDelegation): ManagerDelegation {
    return model;
  }
}
