import { ModelInterceptorContract } from 'cast-response';
import { ViolationType } from '@models/violation-type';
import { AdminResult } from '@models/admin-result';

export class ViolationTypeInterceptor implements ModelInterceptorContract<ViolationType> {
  send(model: Partial<ViolationType>): Partial<ViolationType> {
    return model;
  }

  receive(model: ViolationType): ViolationType {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.typeInfo = new AdminResult().clone(model.typeInfo);
    model.classificationInfo = new AdminResult().clone(model.classificationInfo);
    return model;
  }
}
