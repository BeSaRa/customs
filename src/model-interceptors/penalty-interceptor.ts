import { ModelInterceptorContract } from 'cast-response';
import { Penalty } from '@models/penalty';
import { AdminResult } from '@models/admin-result';
import { PenaltyDetails } from '@models/penalty-details';
import { PenaltyDetailsInterceptor } from '@model-interceptors/penalty-details-interceptor';
const penaltyDetailsInterceptor = new PenaltyDetailsInterceptor();
export class PenaltyInterceptor implements ModelInterceptorContract<Penalty> {
  send(model: Partial<Penalty>): Partial<Penalty> {
    delete model.statusInfo;
    delete model.offenderTypeInfo;
    delete model.violationTypeInfo;
    delete model.penGuidanceInfo;
    model.detailsList = model.detailsList?.map(detail => {
      return new PenaltyDetails().clone<PenaltyDetails>(
        penaltyDetailsInterceptor.send(detail),
      );
    });
    return model;
  }

  receive(model: Penalty): Penalty {
    model.statusInfo = new AdminResult().clone<AdminResult>({
      ...model.statusInfo,
    });
    model.offenderTypeInfo = new AdminResult().clone<AdminResult>({
      ...model.offenderTypeInfo,
    });
    model.violationTypeInfo = new AdminResult().clone<AdminResult>({
      ...model.violationTypeInfo,
    });
    model.penGuidanceInfo = new AdminResult().clone<AdminResult>({
      ...model.penGuidanceInfo,
    });

    model.detailsList = model.detailsList?.map(detail => {
      return new PenaltyDetails().clone<PenaltyDetails>(
        penaltyDetailsInterceptor.receive(detail),
      );
    });
    return model;
  }
}
