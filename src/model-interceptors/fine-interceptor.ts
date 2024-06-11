import { ModelInterceptorContract } from 'cast-response';
import { Fine } from '@models/Fine';
export class FineInterceptor implements ModelInterceptorContract<Fine> {
  send(model: Partial<Fine>): Partial<Fine> {
    return model;
  }

  receive(model: Fine): Fine {
    return model;
  }
}
