import { BaseModel } from '@abstracts/base-model';
import { UserDelegationService } from '@services/user-delegation.service';
import { UserDelegationInterceptor } from '@model-interceptors/user-delegation-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new UserDelegationInterceptor();
  
@InterceptModel({send,receive})
export class UserDelegation extends BaseModel<UserDelegation, UserDelegationService> {
  $$__service_name__$$ = 'UserDelegationService';

  buildForm(controls = false): object {
    return {}
  }
}
