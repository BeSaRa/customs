import { AdminResult } from '@models/admin-result';
import { CaseAttachment } from '@models/case-attachment';
import { ModelInterceptorContract } from 'cast-response';

export class CaseAttachmentInterceptor
  implements ModelInterceptorContract<CaseAttachment>
{
  send(model: Partial<CaseAttachment>): Partial<CaseAttachment> {
    delete model.attachmentTypeInfo;
    return model;
  }

  receive(model: CaseAttachment): CaseAttachment {
    model.attachmentTypeInfo &&
      (model.attachmentTypeInfo = AdminResult.createInstance(
        model.attachmentTypeInfo,
      ));
    return model;
  }
}
