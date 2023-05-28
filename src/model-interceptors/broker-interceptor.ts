import { ModelInterceptorContract } from 'cast-response';
import { Broker } from '@models/broker';
import { AdminResult } from '@models/admin-result';

export class BrokerInterceptor implements ModelInterceptorContract<Broker> {
  send(model: Partial<Broker>): Partial<Broker> {
    delete model.statusInfo;
    return model;
  }

  receive(model: Broker): Broker {
    model.licenseStartDate = model.licenseStartDate?.split('.')[0] ?? model.licenseStartDate;
    model.licenseEndDate = model.licenseEndDate?.split('.')[0] ?? model.licenseEndDate;
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));

    return model;
  }
}
