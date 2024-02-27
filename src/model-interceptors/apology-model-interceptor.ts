import { ModelInterceptorContract } from 'cast-response';
import { ApologyModel } from '@models/apology-model';

export class ApologyModelInterceptor
  implements ModelInterceptorContract<ApologyModel>
{
  send(model: Partial<ApologyModel>): Partial<ApologyModel> {
    console.log(model);
    return model;
  }

  receive(model: ApologyModel): ApologyModel {
    return model;
  }
}
