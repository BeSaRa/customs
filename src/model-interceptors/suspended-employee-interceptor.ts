import { ModelInterceptorContract } from 'cast-response';
import { SuspendedEmployee } from '@models/suspended-employee';

export class SuspendedEmployeeInterceptor implements ModelInterceptorContract<SuspendedEmployee> {
  send(model: Partial<SuspendedEmployee>): Partial<SuspendedEmployee> {
    return model;
  }

  receive(model: SuspendedEmployee): SuspendedEmployee {
    return model;
  }
}
