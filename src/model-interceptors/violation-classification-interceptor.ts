import { ModelInterceptorContract } from 'cast-response';
import { ViolationClassification } from '@models/violation-classification';

export class ViolationClassificationInterceptor
  implements ModelInterceptorContract<ViolationClassification>
{
  send(
    model: Partial<ViolationClassification>
  ): Partial<ViolationClassification> {
    return model;
  }

  receive(model: ViolationClassification): ViolationClassification {
    return model;
  }
}
