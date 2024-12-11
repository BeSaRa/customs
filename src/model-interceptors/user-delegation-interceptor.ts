import { ModelInterceptorContract } from 'cast-response';
import { UserDelegation } from '@models/user-delegation';

export class UserDelegationInterceptor implements ModelInterceptorContract<UserDelegation> {
  send(model: Partial<UserDelegation>): Partial<UserDelegation> {
    return model;
  }

  receive(model: UserDelegation): UserDelegation {
    return model;
  }
}
