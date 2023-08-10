import { ModelInterceptorContract } from 'cast-response';
import { Penalty } from '@models/penalty';
import { AdminResult } from '@models/admin-result';

export class PenaltyInterceptor implements ModelInterceptorContract<Penalty> {
  send(model: Partial<Penalty>): Partial<Penalty> {
    return model;
  }

  receive(model: Penalty): Penalty {
    model.statusInfo = new AdminResult().clone<AdminResult>(model.statusInfo);
    model.offenderTypeInfo = new AdminResult().clone<AdminResult>(model.offenderTypeInfo);

    return model;
  }
}
