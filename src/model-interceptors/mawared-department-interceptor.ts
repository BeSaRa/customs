import { ModelInterceptorContract } from 'cast-response';
import { MawaredDepartment } from '@models/mawared-department';

export class MawaredDepartmentInterceptor
  implements ModelInterceptorContract<MawaredDepartment>
{
  send(model: Partial<MawaredDepartment>): Partial<MawaredDepartment> {
    return model;
  }

  receive(model: MawaredDepartment): MawaredDepartment {
    return model;
  }
}
