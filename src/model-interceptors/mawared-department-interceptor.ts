import { ModelInterceptorContract } from 'cast-response';
import { MawaredDepartment } from '@models/mawared-department';
import { AdminResult } from '@models/admin-result';

export class MawaredDepartmentInterceptor
  implements ModelInterceptorContract<MawaredDepartment>
{
  send(model: Partial<MawaredDepartment>): Partial<MawaredDepartment> {
    delete model.statusInfo;
    return model;
  }

  receive(model: MawaredDepartment): MawaredDepartment {
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.parentInfo &&
      (model.parentInfo = AdminResult.createInstance(model.parentInfo));
    return model;
  }
}
