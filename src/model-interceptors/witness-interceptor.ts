import { ModelInterceptorContract } from 'cast-response';
import { Witness } from '@models/witness';
import { AdminResult } from '@models/admin-result';

export class WitnessInterceptor implements ModelInterceptorContract<Witness> {
  send(model: Partial<Witness>): Partial<Witness> {
    return model;
  }

  receive(model: Witness): Witness {
    model.personTypeInfo = AdminResult.createInstance(model.personTypeInfo);
    model.witnessTypeInfo = AdminResult.createInstance(model.witnessTypeInfo);
    model.statusInfo = AdminResult.createInstance(model.statusInfo);
    return model;
  }
}
