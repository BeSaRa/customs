import { Violation } from '@models/violation';
import { ViolationInterceptor } from '@model-interceptors/violation-interceptor';
import { OffenderInterceptor } from './offender-interceptor';
import { AdminResult } from '@models/admin-result';
import { OffenderViolation } from '@models/offender-violation';
import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';

const offenderInterceptor = new OffenderInterceptor();
const violationInterceptor = new ViolationInterceptor();
export class OffenderViolationInterceptor implements ModelInterceptorContract<OffenderViolation> {
  send(model: Partial<OffenderViolation>): Partial<OffenderViolation> {
    delete model.statusInfo;
    delete model.offenderInfo;
    delete model.violationInfo;
    return model;
  }

  receive(model: OffenderViolation): OffenderViolation {
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.offenderInfo && (model.offenderInfo = new Offender().clone<Offender>(offenderInterceptor.receive(model.offenderInfo)));
    model.violationInfo && (model.violationInfo = new Violation().clone<Violation>(violationInterceptor.receive(model.violationInfo)));

    return model;
  }
}
