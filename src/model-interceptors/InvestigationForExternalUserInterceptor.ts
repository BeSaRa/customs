import { ModelInterceptorContract } from 'cast-response';
import { InvestigationForExternalUser } from '@models/investigation-for-external-user';
import { AdminResult } from '@models/admin-result';
import { OffenderViolationInterceptor } from '@model-interceptors/offender-violation-interceptor';
import { OffenderViolation } from '@models/offender-violation';

const offenderViolationInterceptor = new OffenderViolationInterceptor();

export class InvestigationForExternalUserInterceptor
  implements ModelInterceptorContract<InvestigationForExternalUser>
{
  send(
    model: Partial<InvestigationForExternalUser>,
  ): Partial<InvestigationForExternalUser> {
    return model;
  }

  receive(model: InvestigationForExternalUser): InvestigationForExternalUser {
    model.caseStatusInfo &&
      (model.caseStatusInfo = AdminResult.createInstance(model.caseStatusInfo));
    model.offenderViolationInfo &&
      (model.offenderViolationInfo = model.offenderViolationInfo.map(i => {
        return offenderViolationInterceptor.receive(
          new OffenderViolation().clone<OffenderViolation>({ ...i }),
        );
      }));
    return model;
  }
}
