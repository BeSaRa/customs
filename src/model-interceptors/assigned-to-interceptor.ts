import { AssignedTo } from '@models/assigned-to';
import { ModelInterceptorContract } from 'cast-response';

export class AssignedToInterceptor
  implements ModelInterceptorContract<AssignedTo>
{
  send(model: Partial<AssignedTo>): Partial<AssignedTo> {
    return model;
  }

  receive(model: AssignedTo): AssignedTo {
    model.piName = model.piName.split(':')[0];
    model.startDate = new Date(model.startDate).toLocaleDateString();
    return model;
  }
}
