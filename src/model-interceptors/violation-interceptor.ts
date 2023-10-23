import { ModelInterceptorContract } from 'cast-response';
import { Violation } from '@models/violation';
import { AdminResult } from '@models/admin-result';

export class ViolationInterceptor implements ModelInterceptorContract<Violation> {
  send(model: Partial<Violation>): Partial<Violation> {
    delete model.violationClassificationId;
    return model;
  }

  receive(model: Violation): Violation {
    model.violationTypeInfo = AdminResult.createInstance(model.violationTypeInfo);
    return model;
  }
}