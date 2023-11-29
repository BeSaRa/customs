import { OffenderViolation } from './../models/offender-violation';
import { ModelInterceptorContract } from 'cast-response';
import { Investigation } from '@models/investigation';
import { AdminResult } from '@models/admin-result';
import { OffenderInterceptor } from './offender-interceptor';
import { ViolationInterceptor } from './violation-interceptor';
import { Offender } from '@models/offender';
import { Violation } from '@models/violation';
import { OffenderViolationInterceptor } from './offender-violation-interceptor';

const offenderInterceptor = new OffenderInterceptor();
const violationInterceptor = new ViolationInterceptor();
const offenderViolationInterceptor = new OffenderViolationInterceptor();
export class InvestigationInterceptor implements ModelInterceptorContract<Investigation> {
  send(model: Partial<Investigation>): Partial<Investigation> {
    delete model.$$__service_name__$$;
    delete model.caseStatusInfo;
    delete model.departmentInfo;
    delete model.ouInfo;

    model.offenderInfo = model.offenderInfo?.map(offender => new Offender().clone<Offender>(offenderInterceptor.send(offender)));
    model.offenderViolationInfo = model.offenderViolationInfo?.map(offenderViolation =>
      new OffenderViolation().clone<OffenderViolation>(offenderViolationInterceptor.send(offenderViolation))
    );
    model.violationInfo = model.violationInfo?.map(violation => new Violation().clone<Violation>(violationInterceptor.send(violation)));
    return model;
  }

  receive(model: Investigation): Investigation {
    model.caseStatusInfo && (model.caseStatusInfo = AdminResult.createInstance(model.caseStatusInfo));
    model.sectionInfo && (model.sectionInfo = AdminResult.createInstance(model.sectionInfo));
    model.departmentInfo && (model.departmentInfo = AdminResult.createInstance(model.departmentInfo));
    model.ouInfo && (model.ouInfo = AdminResult.createInstance(model.ouInfo));
    model.creatorInfo && (model.creatorInfo = AdminResult.createInstance(model.creatorInfo));
    model.offenderViolationInfo = model.offenderViolationInfo?.map(offenderViolation =>
      new OffenderViolation().clone<OffenderViolation>(offenderViolationInterceptor.receive(offenderViolation))
    );
    model.offenderInfo = model.offenderInfo?.map(offender =>
      new Offender().clone<Offender>({
        ...offenderInterceptor.receive(offender),
        violations: model.offenderViolationInfo.filter(offenderViolation => offenderViolation.offenderId == offender.id)
          .map((violation) => new OffenderViolation().clone<OffenderViolation>(offenderViolationInterceptor.send(violation))),
      })
    );
    model.violationInfo = model.violationInfo?.map(violation => new Violation().clone<Violation>(violationInterceptor.receive(violation)));
    return model;
  }
}
