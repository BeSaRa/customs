import { BaseModel } from '@abstracts/base-model';
import { EmailTemplateService } from '@services/email-template.service';
import { EmailTemplateInterceptor } from '@model-interceptors/email-template-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';

const { send, receive } = new EmailTemplateInterceptor();

@InterceptModel({ send, receive })
export class EmailTemplate extends BaseModel<
  EmailTemplate,
  EmailTemplateService
> {
  $$__service_name__$$ = 'EmailTemplateService';

  arBodyTemplate!: string;
  arSubjectTemplate!: string;

  enBodyTemplate!: string;
  enSubjectTemplate!: string;
  isGlobal = true;

  override status = StatusTypes.ACTIVE;

  buildForm(controls = false): object {
    const {
      arBodyTemplate,
      arName,
      arSubjectTemplate,
      enBodyTemplate,
      enName,
      enSubjectTemplate,
      isGlobal,
      status,
    } = this;
    return {
      arBodyTemplate: controls
        ? [arBodyTemplate, CustomValidators.required]
        : arBodyTemplate,
      arName: controls
        ? [
            arName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('AR_NUM'),
            ],
          ]
        : arName,
      arSubjectTemplate: controls
        ? [arSubjectTemplate, CustomValidators.required]
        : arSubjectTemplate,
      enBodyTemplate: controls
        ? [enBodyTemplate, CustomValidators.required]
        : enBodyTemplate,
      enName: controls
        ? [
            enName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('ENG_NUM'),
            ],
          ]
        : enName,
      enSubjectTemplate: controls
        ? [enSubjectTemplate, CustomValidators.required]
        : enSubjectTemplate,
      isGlobal: controls ? [isGlobal, CustomValidators.required] : isGlobal,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
