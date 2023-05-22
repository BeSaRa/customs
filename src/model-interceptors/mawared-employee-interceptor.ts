import { ModelInterceptorContract } from 'cast-response';
import { MawaredEmployee } from '@models/mawared-employee';

export class MawaredEmployeeInterceptor
  implements ModelInterceptorContract<MawaredEmployee>
{
  send(model: Partial<MawaredEmployee>): Partial<MawaredEmployee> {
    return model;
  }

  receive(model: MawaredEmployee): MawaredEmployee {
    return model;
  }
}
