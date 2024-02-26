import { ModelInterceptorContract } from 'cast-response';
import { ObligationToAttend } from '@models/obligation-to-attend';

export class ObligationToAttendInterceptor
  implements ModelInterceptorContract<ObligationToAttend>
{
  send(model: Partial<ObligationToAttend>): Partial<ObligationToAttend> {
    return model;
  }

  receive(model: ObligationToAttend): ObligationToAttend {
    return model;
  }
}
