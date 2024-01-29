import { AdminResult } from '@models/admin-result';
import { ModelInterceptorContract } from 'cast-response';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { ClearingAgentInterceptor } from '@model-interceptors/clearing-agent-interceptor';

export class OffenderInterceptor implements ModelInterceptorContract<Offender> {
  send(model: Partial<Offender>): Partial<Offender> {
    delete model.violations;
    delete model.offenderOUInfo;
    delete model.offenderInfo;
    delete model.typeInfo;
    delete model.agencyInfo;
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
    model.offenderInfo &&
      model.offenderInfo.statusInfo &&
      (model.offenderInfo.statusInfo = AdminResult.createInstance(
        model.offenderInfo.statusInfo,
      ));
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
    return model;
  }
}
