import { BaseModel } from '@abstracts/base-model';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ViolationClassificationInterceptor } from '@model-interceptors/violation-classification-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new ViolationClassificationInterceptor();

@InterceptModel({ send, receive })
export class ViolationClassification extends BaseModel<
  ViolationClassification,
  ViolationClassificationService
> {
  $$__service_name__$$ = 'ViolationClassificationService';
  penaltyType!: number;

  buildForm(controls = false): object {
    const { arName, enName, penaltyType, status } = this;

    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      penaltyType: controls
        ? [penaltyType, CustomValidators.required]
        : penaltyType,
      status: status,
    };
  }
}
