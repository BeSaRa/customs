import { ModelInterceptorContract } from 'cast-response';
import { Services } from '@models/services';
import { AdminResult } from '@models/admin-result';

export class ServicesInterceptor implements ModelInterceptorContract<Services> {
  send(model: Partial<Services>): Partial<Services> {
    return model;
  }

  receive(model: Services): Services {
    model.updatedOnString = new Date(model.updatedOn).toDateString();
    model.updatedByInfo = AdminResult.createInstance(model.updatedByInfo);

    return model;
  }
}
