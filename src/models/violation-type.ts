import { BaseModel } from '@abstracts/base-model';
import { ViolationTypeService } from '@services/violation-type.service';
import { ViolationTypeInterceptor } from '@model-interceptors/violation-type-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

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
  buildForm(controls = false): object {
    const {
      arName,
      enName,
      penaltyType,
      violationClassificationId,
      penaltyGracePeriod,
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
    };
  }
}
