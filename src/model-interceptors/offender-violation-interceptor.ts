import { Violation } from '@models/violation';
import { ViolationInterceptor } from '@model-interceptors/violation-interceptor';
import { OffenderInterceptor } from './offender-interceptor';
import { AdminResult } from '@models/admin-result';
import { OffenderViolation } from '@models/offender-violation';
import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';

const offenderInterceptor = new OffenderInterceptor();
const violationInterceptor = new ViolationInterceptor();

export class OffenderViolationInterceptor
  implements ModelInterceptorContract<OffenderViolation>
{
  send(model: Partial<OffenderViolation>): Partial<OffenderViolation> {
    delete model.statusInfo;
    delete model.offenderInfo;
    delete model.violationInfo;
    return model;
  }

  receive(model: OffenderViolation): OffenderViolation {
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.offenderInfo &&
      (model.offenderInfo = offenderInterceptor.receive(
        new Offender().clone<Offender>({
          ...model.offenderInfo,
        }),
      ));
    model.violationInfo &&
      (model.violationInfo = violationInterceptor.receive(
        new Violation().clone<Violation>({
          ...model.violationInfo,
        }),
      ));
    return model;
  }
}
