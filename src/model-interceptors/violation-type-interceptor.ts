import { ModelInterceptorContract } from 'cast-response';
import { ViolationType } from '@models/violation-type';
import { AdminResult } from '@models/admin-result';

export class ViolationTypeInterceptor implements ModelInterceptorContract<ViolationType> {
  send(model: Partial<ViolationType>): Partial<ViolationType> {
    return model;
  }

  receive(model: ViolationType): ViolationType {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.offenderTypeInfo = new AdminResult().clone(model.offenderTypeInfo);
    model.classificationInfo = new AdminResult().clone(model.classificationInfo);
    model.violationLevelInfo = new AdminResult().clone(model.violationLevelInfo);
    model.customsViolationEffectInfo = new AdminResult().clone(model.customsViolationEffectInfo);
    model.managerDecisionInfo = new AdminResult().clone(model.managerDecisionInfo);
    model.responsibilityRepeatViolationsInfo = new AdminResult().clone(model.responsibilityRepeatViolationsInfo);
    model.criminalTypeInfo = new AdminResult().clone(model.criminalTypeInfo);
    return model;
  }
}
