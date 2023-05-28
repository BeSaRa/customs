import { ModelInterceptorContract } from 'cast-response';
import { BrokerCompany } from '@models/broker-company';
import { AdminResult } from '@models/admin-result';

export class BrokerCompanyInterceptor implements ModelInterceptorContract<BrokerCompany> {
  send(model: Partial<BrokerCompany>): Partial<BrokerCompany> {
    delete model.statusInfo;
    return model;
  }

  receive(model: BrokerCompany): BrokerCompany {
    model.licenseStartDate = new Date(model.licenseStartDate).toDateString();
    model.licenseEndDate = new Date(model.licenseEndDate).toDateString();
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));

    return model;
  }
}
