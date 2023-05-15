import { BaseModel } from '@abstracts/base-model';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationTypeInterceptor } from '@model-interceptors/violation-type-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { AdminResult } from './admin-result';
import { StatusTypes } from '@enums/status-types';

const { send, receive } = new ViolationTypeInterceptor();

@InterceptModel({ send, receive })
export class ViolationType extends BaseModel<
  ViolationType,
  ViolationTypeService
> {
  $$__service_name__$$ = 'ViolationTypeService';
  penaltyType!: number;
  violationClassificationId!: number;
  penaltyGracePeriod!: number;
  typeInfo!: AdminResult;
  classificationInfo!: AdminResult;

  override status = StatusTypes.ACTIVE;
  buildForm(controls = false): object {
    const {
      arName,
      enName,
      penaltyType,
      violationClassificationId,
      penaltyGracePeriod,
      status,
    } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      penaltyType: controls
        ? [penaltyType, CustomValidators.required]
        : penaltyType,
      violationClassificationId: controls
        ? [violationClassificationId, CustomValidators.required]
        : violationClassificationId,
      penaltyGracePeriod: controls
        ? [penaltyGracePeriod, CustomValidators.required]
        : penaltyGracePeriod,
      status: status,
    };
  }
}
