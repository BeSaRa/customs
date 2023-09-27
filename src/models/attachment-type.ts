import { BaseModel } from '@abstracts/base-model';
import { AttachmentTypeService } from '@services/attachment-type.service';
import { AttachmentTypeInterceptor } from '@model-interceptors/attachment-type-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new AttachmentTypeInterceptor();

@InterceptModel({ send, receive })
export class AttachmentType extends BaseModel<AttachmentType, AttachmentTypeService> {
  $$__service_name__$$ = 'AttachmentTypeService';

  buildForm(controls = false): object {
    return {};
  }
}
