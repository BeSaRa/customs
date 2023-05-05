import { ModelInterceptorContract } from 'cast-response';
import { Penalty } from '@models/penalty';

export class PenaltyInterceptor implements ModelInterceptorContract<Penalty> {
  send(model: Partial<Penalty>): Partial<Penalty> {
    return model;
  }

  receive(model: Penalty): Penalty {
    return model;
  }
}
