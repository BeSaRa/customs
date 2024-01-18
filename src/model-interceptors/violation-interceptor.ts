import { ModelInterceptorContract } from 'cast-response';
import { Violation } from '@models/violation';
import { AdminResult } from '@models/admin-result';

export class ViolationInterceptor
  implements ModelInterceptorContract<Violation>
{
  send(model: Partial<Violation>): Partial<Violation> {
    delete model.violationClassificationId;
    delete model.offenderTypeInfo;
    delete model.violationTypeInfo;
    delete model.classificationInfo;
    delete model.classificationInfo;
    delete model.competentProsecutionDecisionInfo;
    delete model.courtDecisionInfo;
    delete model.drugProsecutionDecisionInfo;
    delete model.forensicLabAnalysisInfo;
    delete model.securityAdminDecisionInfo;
    return model;
  }

  receive(model: Violation): Violation {
    model.offenderTypeInfo = AdminResult.createInstance(model.offenderTypeInfo);
    model.violationTypeInfo = AdminResult.createInstance(
      model.violationTypeInfo,
    );
    model.classificationInfo = AdminResult.createInstance(
      model.classificationInfo,
    );
    model.competentProsecutionDecisionInfo = AdminResult.createInstance(
      model.competentProsecutionDecisionInfo,
    );
    model.courtDecisionInfo = AdminResult.createInstance(
      model.courtDecisionInfo,
    );
    model.drugProsecutionDecisionInfo = AdminResult.createInstance(
      model.drugProsecutionDecisionInfo,
    );
    model.forensicLabAnalysisInfo = AdminResult.createInstance(
      model.forensicLabAnalysisInfo,
    );
    model.securityAdminDecisionInfo = AdminResult.createInstance(
      model.securityAdminDecisionInfo,
    );
    return model;
  }
}
