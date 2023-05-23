import { ModelInterceptorContract } from 'cast-response';
import { BrokerCompany } from '@models/broker-company';

export class BrokerCompanyInterceptor implements ModelInterceptorContract<BrokerCompany> {
  send(model: Partial<BrokerCompany>): Partial<BrokerCompany> {
    return model;
  }

  receive(model: BrokerCompany): BrokerCompany {
    model.licenseStartDate = new Date(model.licenseStartDate).toDateString();
    model.licenseEndDate = new Date(model.licenseEndDate).toDateString();

    return model;
  }
}
