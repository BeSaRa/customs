import { ModelInterceptorContract } from 'cast-response';
import { Investigation } from '@models/investigation';
import { AdminResult } from '@models/admin-result';
import { Offender } from '@models/offender';
import { OffenderInterceptor } from '@model-interceptors/offender-interceptor';
import { Violation } from '@models/violation';
import { ViolationInterceptor } from '@model-interceptors/violation-interceptor';
import { OffenderViolationInterceptor } from '@model-interceptors/offender-violation-interceptor';
import { OffenderViolation } from '@models/offender-violation';

const offenderInterceptor = new OffenderInterceptor();
const violationInterceptor = new ViolationInterceptor();
const offenderViolationInterceptor = new OffenderViolationInterceptor();

export class InvestigationInterceptor
  implements ModelInterceptorContract<Investigation>
{
  send(model: Partial<Investigation>): Partial<Investigation> {
    delete model.$$__service_name__$$;
    delete model.caseStatusInfo;
    delete model.departmentInfo;
    delete model.securityLevelInfo;
    delete model.ouInfo;
    delete model.caseStatusInfo;
    delete model.creatorInfo;
    delete model.sectionInfo;
    delete model.offenderInfo;
    delete model.offenderViolationInfo;
    delete model.violationInfo;
    return model;
  }

  receive(model: Investigation): Investigation {
    model.caseStatusInfo &&
      (model.caseStatusInfo = AdminResult.createInstance(model.caseStatusInfo));
    model.sectionInfo &&
      (model.sectionInfo = AdminResult.createInstance(model.sectionInfo));
    model.departmentInfo &&
      (model.departmentInfo = AdminResult.createInstance(model.departmentInfo));
    model.ouInfo && (model.ouInfo = AdminResult.createInstance(model.ouInfo));
    model.creatorInfo &&
      (model.creatorInfo = AdminResult.createInstance(model.creatorInfo));
    model.securityLevelInfo &&
      (model.securityLevelInfo = AdminResult.createInstance(
        model.securityLevelInfo,
      ));

    model.offenderInfo =
      model.offenderInfo &&
      model.offenderInfo.map(item => {
        return offenderInterceptor.receive(
          new Offender().clone<Offender>({
            ...item,
          }),
        );
      });
    model.violationInfo =
      model.violationInfo &&
      model.violationInfo.map(item => {
        return violationInterceptor.receive(
          new Violation().clone<Violation>({ ...item }),
        );
      });

    model.offenderViolationInfo &&
      (model.offenderViolationInfo = model.offenderViolationInfo.map(i => {
        return offenderViolationInterceptor.receive(
          new OffenderViolation().clone<OffenderViolation>({ ...i }),
        );
      }));

    return model;
  }
}
