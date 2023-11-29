import { AdminResult } from '@models/admin-result';
import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';

export class OffenderInterceptor implements ModelInterceptorContract<Offender> {
  send(model: Partial<Offender>): Partial<Offender> {
    delete model.violations;
    return model;
  }

  receive(model: Offender): Offender {
    model.offenderOUInfo && (model.offenderOUInfo = AdminResult.createInstance(model.offenderOUInfo));
    model.offenderInfo && model.offenderInfo.typeInfo && (model.offenderInfo.typeInfo = AdminResult.createInstance(model.offenderInfo.typeInfo));
    model.offenderInfo && model.offenderInfo.statusInfo && (model.offenderInfo.statusInfo = AdminResult.createInstance(model.offenderInfo.statusInfo));
    model.typeInfo && (model.typeInfo = AdminResult.createInstance(model.typeInfo));
    
    
    return model;
  }
}
