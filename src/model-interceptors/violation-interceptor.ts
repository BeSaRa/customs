import { ModelInterceptorContract } from 'cast-response';
import { Violation } from '@models/violation';

export class ViolationInterceptor implements ModelInterceptorContract<Violation> {
  send(model: Partial<Violation>): Partial<Violation> {
    delete model.violationClassificationId;
    return model;
  }

  receive(model: Violation): Violation {
    return model;
  }
}
