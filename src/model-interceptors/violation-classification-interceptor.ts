import { ModelInterceptorContract } from 'cast-response';
import { ViolationClassification } from '@models/violation-classification';
import { AdminResult } from '@models/admin-result';

export class ViolationClassificationInterceptor
  implements ModelInterceptorContract<ViolationClassification>
{
  send(
    model: Partial<ViolationClassification>,
  ): Partial<ViolationClassification> {
    return model;
  }

  receive(model: ViolationClassification): ViolationClassification {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.offenderTypeInfo = new AdminResult().clone(model.offenderTypeInfo);
    return model;
  }
}
