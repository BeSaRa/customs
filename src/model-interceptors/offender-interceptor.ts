import { AdminResult } from '@models/admin-result';
import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';

export class OffenderInterceptor implements ModelInterceptorContract<Offender> {
  send(model: Partial<Offender>): Partial<Offender> {
    return model;
  }

  receive(model: Offender): Offender {
    model.offenderOUInfo && (model.offenderOUInfo = AdminResult.createInstance(model.offenderOUInfo));

    return model;
  }
}
