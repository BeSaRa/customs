import { ModelInterceptorContract } from 'cast-response';
import { Penalty } from '@models/penalty';
import { AdminResult } from '@models/admin-result';
import { PenaltyDetails } from '@models/penalty-details';

export class PenaltyInterceptor implements ModelInterceptorContract<Penalty> {
  send(model: Partial<Penalty>): Partial<Penalty> {
    delete model.statusInfo;
    delete model.offenderTypeInfo;
    return model;
  }

  receive(model: Penalty): Penalty {
    model.statusInfo = new AdminResult().clone<AdminResult>(model.statusInfo);
    model.offenderTypeInfo = new AdminResult().clone<AdminResult>(
      model.offenderTypeInfo,
    );
    model.violationTypeInfo = new AdminResult().clone<AdminResult>(
      model.violationTypeInfo,
    );
    model.penGuidanceInfo = new AdminResult().clone<AdminResult>(
      model.penGuidanceInfo,
    );
    model.detailsList = model.detailsList
      ? model.detailsList.map((detail) => {
          detail.penaltySignerInfo = new AdminResult().clone<AdminResult>(
            detail.penaltySignerInfo,
          );
          detail.legalRuleInfo = new AdminResult().clone<AdminResult>(
            detail.legalRuleInfo,
          );
          detail.offenderLevelInfo = new AdminResult().clone<AdminResult>(
            detail.offenderLevelInfo,
          );
          return new PenaltyDetails().clone<PenaltyDetails>(detail);
        })
      : [];
    return model;
  }
}
