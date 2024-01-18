import { ModelInterceptorContract } from 'cast-response';
import { AttachmentType } from '@models/attachment-type';
import { AdminResult } from '@models/admin-result';

export class AttachmentTypeInterceptor
  implements ModelInterceptorContract<AttachmentType>
{
  send(model: Partial<AttachmentType>): Partial<AttachmentType> {
    delete model.statusInfo;
    return model;
  }

  receive(model: AttachmentType): AttachmentType {
    model.statusInfo &&
      (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    return model;
  }
}
