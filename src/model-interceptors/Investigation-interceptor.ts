import { ModelInterceptorContract } from 'cast-response';
import { Investigation } from '@models/investigation';
import { AdminResult } from '@models/admin-result';

export class InvestigationInterceptor
  implements ModelInterceptorContract<Investigation>
{
  send(model: Partial<Investigation>): Partial<Investigation> {
    delete model.$$__service_name__$$;
    delete model.caseStatusInfo;
    delete model.departmentInfo;
    delete model.limitedAccessInfo;
    delete model.ouInfo;
    delete model.namesOfOffenders;
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
    model.limitedAccessInfo &&
      (model.limitedAccessInfo = AdminResult.createInstance(
        model.limitedAccessInfo
      ));

    return model;
  }
}
