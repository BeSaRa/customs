import { ModelInterceptorContract } from 'cast-response';
import { Services } from '@models/services';

export class ServicesInterceptor implements ModelInterceptorContract<Services> {
  send(model: Partial<Services>): Partial<Services> {
    return model;
  }

  receive(model: Services): Services {
    return model;
  }
}
