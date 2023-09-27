import { ModelInterceptorContract } from 'cast-response';
import { AttachmentType } from '@models/attachment-type';

export class AttachmentTypeInterceptor implements ModelInterceptorContract<AttachmentType> {
  send(model: Partial<AttachmentType>): Partial<AttachmentType> {
    return model;
  }

  receive(model: AttachmentType): AttachmentType {
    return model;
  }
}
