import { BaseModel } from '@abstracts/base-model';
import { ServiceStepsService } from '@services/service-steps.service';
import { ServiceStepsInterceptor } from '@model-interceptors/service-steps-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ServiceStepsInterceptor();
  
@InterceptModel({send,receive})
export class ServiceSteps extends BaseModel<ServiceSteps, ServiceStepsService> {
  $$__service_name__$$ = 'ServiceStepsService';

  buildForm(controls = false): object {
    return {}
  }
}
