import { BaseModel } from '@abstracts/base-model';
import { ManagerDelegationService } from '@services/manager-delegation.service';
import { ManagerDelegationInterceptor } from '@model-interceptors/manager-delegation-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ManagerDelegationInterceptor();

@InterceptModel({ send, receive })
export class ManagerDelegation extends BaseModel<
  ManagerDelegation,
  ManagerDelegationService
> {
  $$__service_name__$$ = 'ManagerDelegationService';

  buildForm(controls = false): object {
    return {};
  }
}
