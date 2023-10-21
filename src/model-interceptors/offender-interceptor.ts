import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';

export class OffenderInterceptor implements ModelInterceptorContract<Offender> {
  send(model: Partial<Offender>): Partial<Offender> {
    return model;
  }

  receive(model: Offender): Offender {
    return model;
  }
}
