import { ModelInterceptorContract } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { Grievance } from '@models/grievance';

export class GrievanceInterceptor
  implements ModelInterceptorContract<Grievance>
{
  send(model: Partial<Grievance>): Partial<Grievance> {
    delete model.$$__service_name__$$;
    delete model.caseStatusInfo;
    delete model.departmentInfo;
    delete model.securityLevelInfo;
    delete model.ouInfo;
    delete model.creatorInfo;
    delete model.sectionInfo;
    delete model.applicantTypeInfo;
    delete model.offenderInfo;
    delete model.offenderTypeInfo;
    delete model.penaltyInfo;
    delete model.penaltySignerInfo;
    delete model.penaltySignerRoleInfo;
    delete model.presidentAssistantOuInfo;
    delete model.finalDecisionInfo;
    return model;
  }

  receive(model: Grievance): Grievance {
    model.finalDecisionInfo &&
      (model.finalDecisionInfo = AdminResult.createInstance(
        model.finalDecisionInfo,
      ));
    model.caseStatusInfo &&
      (model.caseStatusInfo = AdminResult.createInstance(model.caseStatusInfo));
    model.sectionInfo &&
      (model.sectionInfo = AdminResult.createInstance(model.sectionInfo));
    model.departmentInfo &&
      (model.departmentInfo = AdminResult.createInstance(model.departmentInfo));
    model.ouInfo && (model.ouInfo = AdminResult.createInstance(model.ouInfo));
    model.creatorInfo = AdminResult.createInstance(model.creatorInfo);
    model.securityLevelInfo &&
      (model.securityLevelInfo = AdminResult.createInstance(
        model.securityLevelInfo,
      ));
    model.applicantTypeInfo &&
      (model.applicantTypeInfo = AdminResult.createInstance(
        model.applicantTypeInfo,
      ));
    model.offenderInfo &&
      (model.offenderInfo = AdminResult.createInstance(model.offenderInfo));
    model.offenderTypeInfo &&
      (model.offenderTypeInfo = AdminResult.createInstance(
        model.offenderTypeInfo,
      ));
    model.penaltyInfo &&
      (model.penaltyInfo = AdminResult.createInstance(model.penaltyInfo));
    model.penaltySignerInfo &&
      (model.penaltySignerInfo = AdminResult.createInstance(
        model.penaltySignerInfo,
      ));
    model.penaltySignerRoleInfo &&
      (model.penaltySignerRoleInfo = AdminResult.createInstance(
        model.penaltySignerRoleInfo,
      ));
    model.presidentAssistantOuInfo &&
      (model.presidentAssistantOuInfo = AdminResult.createInstance(
        model.presidentAssistantOuInfo,
      ));
    model.securityLevelInfo &&
      (model.securityLevelInfo = AdminResult.createInstance(
        model.securityLevelInfo,
      ));
    return model;
  }
}
