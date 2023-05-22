import { ModelInterceptorContract } from 'cast-response';
import { Broker } from '@models/broker';

export class BrokerInterceptor implements ModelInterceptorContract<Broker> {
  send(model: Partial<Broker>): Partial<Broker> {
    return model;
  }

  receive(model: Broker): Broker {
    return model;
  }
}
