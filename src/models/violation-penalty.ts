import { BaseModel } from '@abstracts/base-model';
import { ViolationPenaltyService } from '@services/violation-penalty.service';
import { ViolationPenaltyInterceptor } from '@model-interceptors/violation-penalty-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new ViolationPenaltyInterceptor();

@InterceptModel({ send, receive })
export class ViolationPenalty extends BaseModel<ViolationPenalty, ViolationPenaltyService> {
  $$__service_name__$$ = 'ViolationPenaltyService';

  violationTypeId!: number;
  violationTypeInfo!: AdminResult;

  repeat!: number;

  offenderType!: number;
  offenderTypeInfo!: AdminResult;
  offenderLevel!: number;
  offenderLevelInfo!: AdminResult;

  penaltyId!: number;
  penaltySigner!: number;
  penaltyGuidance!: number;
  penaltyInfo!: AdminResult;
  penaltySignerInfo!: AdminResult;
  penaltyGuidanceInfo!: AdminResult;
  override status: number = 1;
  buildForm(controls = false): object {
    const { repeat, violationTypeId, penaltySigner, penaltyId, penaltyGuidance, offenderType, offenderLevel, status } = this;
    return {
      repeat: controls ? [repeat, CustomValidators.required] : repeat,
      violationTypeId: controls ? [violationTypeId, CustomValidators.required] : violationTypeId,
      penaltySigner: controls ? [penaltySigner, CustomValidators.required] : penaltySigner,
      penaltyId: controls ? [penaltyId, CustomValidators.required] : penaltyId,
      penaltyGuidance: controls ? [penaltyGuidance] : penaltyGuidance,
      offenderType: controls ? [offenderType, CustomValidators.required] : offenderType,
      offenderLevel: controls ? [offenderLevel] : offenderLevel,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
