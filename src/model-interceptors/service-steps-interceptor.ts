import { ModelInterceptorContract } from 'cast-response';
import { ServiceSteps } from '@models/service-steps';

export class ServiceStepsInterceptor implements ModelInterceptorContract<ServiceSteps> {
  send(model: Partial<ServiceSteps>): Partial<ServiceSteps> {
    return model;
  }

  receive(model: ServiceSteps): ServiceSteps {
    return model;
  }
}
