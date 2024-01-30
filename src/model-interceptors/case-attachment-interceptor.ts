import { AdminResult } from '@models/admin-result';
import { CaseAttachment } from '@models/case-attachment';
import { ModelInterceptorContract } from 'cast-response';

export class CaseAttachmentInterceptor
  implements ModelInterceptorContract<CaseAttachment>
{
  send(model: Partial<CaseAttachment>): Partial<CaseAttachment> {
    delete model.attachmentTypeInfo;
    delete model.creatorInfo;
    delete model.ouInfo;
    return model;
  }

  receive(model: CaseAttachment): CaseAttachment {
    model.attachmentTypeInfo &&
      (model.attachmentTypeInfo = AdminResult.createInstance(
        model.attachmentTypeInfo,
      ));
    model.creatorInfo &&
      (model.creatorInfo = AdminResult.createInstance(model.creatorInfo));
    model.ouInfo && (model.ouInfo = AdminResult.createInstance(model.ouInfo));

    return model;
  }
}
