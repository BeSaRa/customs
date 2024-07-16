import { AdminResult } from '@models/admin-result';
import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { ClearingAgentInterceptor } from '@model-interceptors/clearing-agent-interceptor';
import { PenaltySignerTypes } from '@enums/penalty-signer-types';
import { CustomsViolationEffect } from '@enums/customs-violation-effect';

export class OffenderInterceptor implements ModelInterceptorContract<Offender> {
  send(model: Partial<Offender>): Partial<Offender> {
    delete model.violations;
    delete model.offenderOUInfo;
    delete model.offenderInfo;
    delete model.typeInfo;
    delete model.agencyInfo;
    delete model.penaltyInfo;
    delete model.statusInfo;
    delete model.decisionTypeInfo;
    delete model.penaltySignerInfo;
    delete model.penaltySignerRoleInfo;
    delete model.penaltyStatusInfo;
    delete model.directedToInfo;
    return model;
  }

  receive(model: Offender): Offender {
    const employeeInterceptor = new MawaredEmployeeInterceptor();
    const agentInterceptor = new ClearingAgentInterceptor();
    model.offenderOUInfo &&
      (model.offenderOUInfo = AdminResult.createInstance(model.offenderOUInfo));
    model.offenderInfo &&
      model.offenderInfo.typeInfo &&
      (model.offenderInfo.typeInfo = AdminResult.createInstance(
        model.offenderInfo.typeInfo,
      ));
    model.decisionTypeInfo &&
      (model.decisionTypeInfo = AdminResult.createInstance(
        model.decisionTypeInfo,
      ));
    model.penaltySignerInfo &&
      (model.penaltySignerInfo = AdminResult.createInstance(
        model.penaltySignerInfo,
      ));
    model.penaltySignerRoleInfo &&
      (model.penaltySignerRoleInfo = AdminResult.createInstance(
        model.penaltySignerRoleInfo,
      ));
    model.penaltyStatusInfo &&
      (model.penaltyStatusInfo = AdminResult.createInstance(
        model.penaltyStatusInfo,
      ));
    model.directedToInfo =
      model.penaltySignerRoleInfo?.lookupKey ===
      PenaltySignerTypes.MANAGER_DIRECTOR
        ? AdminResult.createInstance({
            arName: 'مساعد الرئيس',
            enName: 'President assistant',
          })
        : AdminResult.createInstance({
            arName: 'الرئيس',
            enName: 'President',
          });
    model.penaltyInfo &&
      (model.penaltyInfo = AdminResult.createInstance(model.penaltyInfo));
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.typeInfo &&
      (model.typeInfo = AdminResult.createInstance(model.typeInfo));
    model.agencyInfo &&
      (model.agencyInfo = AdminResult.createInstance(model.agencyInfo));

    model.offenderInfo =
      model.offenderInfo && model.offenderInfo.type === OffenderTypes.EMPLOYEE
        ? employeeInterceptor.receive(
            new MawaredEmployee().clone<MawaredEmployee>({
              ...model.offenderInfo,
            }),
          )
        : agentInterceptor.receive(
            new ClearingAgent().clone<ClearingAgent>({ ...model.offenderInfo }),
          );
    model.customsViolationEffect =
      model.customsViolationEffect ?? CustomsViolationEffect.BROKER;
    model.customsViolationEffectInfo = new AdminResult().clone(
      model.customsViolationEffectInfo,
    );
    return model;
  }
}
