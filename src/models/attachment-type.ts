import { BaseModel } from '@abstracts/base-model';
import { AttachmentTypeService } from '@services/attachment-type.service';
import { AttachmentTypeInterceptor } from '@model-interceptors/attachment-type-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new AttachmentTypeInterceptor();

@InterceptModel({ send, receive })
export class AttachmentType extends BaseModel<AttachmentType, AttachmentTypeService> {
  $$__service_name__$$ = 'AttachmentTypeService';

  buildForm(controls = false): object {
    const { arName, enName, status } = this;
    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      status: controls ? [status ? status : 1, CustomValidators.required] : status ? status : 1,
    };
  }
}
