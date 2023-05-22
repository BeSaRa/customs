import { BaseModel } from '@abstracts/base-model';
import { BrokerService } from '@services/broker.service';
import { BrokerInterceptor } from '@model-interceptors/broker-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new BrokerInterceptor();

@InterceptModel({ send, receive })
export class Broker extends BaseModel<Broker, BrokerService> {
  $$__service_name__$$ = 'BrokerService';

  buildForm(controls = false): object {
    return {};
  }
}
