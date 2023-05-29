import { ModelInterceptorContract } from 'cast-response';
import { MawaredEmployee } from '@models/mawared-employee';
import { AdminResult } from '@models/admin-result';

export class MawaredEmployeeInterceptor implements ModelInterceptorContract<MawaredEmployee> {
  send(model: Partial<MawaredEmployee>): Partial<MawaredEmployee> {
    delete model.statusInfo;
    return model;
  }

  receive(model: MawaredEmployee): MawaredEmployee {
    model.statusInfo = new AdminResult().clone(model.statusInfo) || '';
    return model;
  }
}
