import { BaseModel } from '@abstracts/base-model';
import { EmailTemplateService } from '@services/email-template.service';
import { EmailTemplateInterceptor } from '@model-interceptors/email-template-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new EmailTemplateInterceptor();

@InterceptModel({ send, receive })
export class EmailTemplate extends BaseModel<EmailTemplate, EmailTemplateService> {
  $$__service_name__$$ = 'EmailTemplateService';

  arBodyTemplate!: string;
  arSubjectTemplate!: string;

  enBodyTemplate!: string;
  enSubjectTemplate!: string;

  buildForm(controls = false): object {
    const { arBodyTemplate, arName, arSubjectTemplate, enBodyTemplate, enName, enSubjectTemplate, status } = this;
    return {
      arBodyTemplate: controls ? [arBodyTemplate, CustomValidators.required] : arBodyTemplate,
      arName: controls ? [arName, CustomValidators.required] : arName,
      arSubjectTemplate: controls ? [arSubjectTemplate, CustomValidators.required] : arSubjectTemplate,
      enBodyTemplate: controls ? [enBodyTemplate, CustomValidators.required] : enBodyTemplate,
      enName: controls ? [enName, CustomValidators.required] : enName,
      enSubjectTemplate: controls ? [enSubjectTemplate, CustomValidators.required] : enSubjectTemplate,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
