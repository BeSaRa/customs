import { ModelInterceptorContract } from 'cast-response';
import { ViolationType } from '@models/violation-type';

export class ViolationTypeInterceptor
  implements ModelInterceptorContract<ViolationType>
{
  send(model: Partial<ViolationType>): Partial<ViolationType> {
    return model;
  }

  receive(model: ViolationType): ViolationType {
    return model;
  }
}
