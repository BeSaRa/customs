import { BaseModel } from '@abstracts/base-model';
import { ViolationClassificationService } from '@services/violation-classification.service';
import { ViolationClassificationInterceptor } from '@model-interceptors/violation-classification-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { AdminResult } from './admin-result';
import { StatusTypes } from '@enums/status-types';

const { send, receive } = new ViolationClassificationInterceptor();

@InterceptModel({ send, receive })
export class ViolationClassification extends BaseModel<ViolationClassification, ViolationClassificationService> {
  $$__service_name__$$ = 'ViolationClassificationService';
  offenderType!: number;
  offenderTypeInfo!: AdminResult;
  key!: string;
  isSystem!: boolean;
  override status = StatusTypes.ACTIVE;
  buildForm(controls = false): object {
    const { arName, enName, offenderType, key, isSystem, status } = this;

    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_ONLY')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_ONLY')]] : enName,
      key: controls ? [key, [CustomValidators.required, CustomValidators.maxLength(20), CustomValidators.pattern('ENG_ONLY')]] : key,
      offenderType: controls ? [offenderType, CustomValidators.required] : offenderType,
      status: status,
      isSystem: controls ? (isSystem ? [isSystem] : [false]) : isSystem ? isSystem : false,
    };
  }
}
