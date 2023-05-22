import { ModelInterceptorContract } from 'cast-response';
import { BrokerCompany } from '@models/broker-company';

export class BrokerCompanyInterceptor implements ModelInterceptorContract<BrokerCompany> {
  send(model: Partial<BrokerCompany>): Partial<BrokerCompany> {
    return model;
  }

  receive(model: BrokerCompany): BrokerCompany {
    return model;
  }
}
