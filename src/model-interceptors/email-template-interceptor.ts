import { ModelInterceptorContract } from 'cast-response';
import { EmailTemplate } from '@models/email-template';
import { AdminResult } from '@models/admin-result';

export class EmailTemplateInterceptor implements ModelInterceptorContract<EmailTemplate> {
  send(model: Partial<EmailTemplate>): Partial<EmailTemplate> {
    delete model.statusInfo;
    return model;
  }

  receive(model: EmailTemplate): EmailTemplate {
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    return model;
  }
}
