import { BaseModel } from '@abstracts/base-model';
import { LegalRuleService } from '@services/legal-rule.service';
import { LegalRuleInterceptor } from '@model-interceptors/legal-rule-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new LegalRuleInterceptor();

@InterceptModel({ send, receive })
export class LegalRule extends BaseModel<LegalRule, LegalRuleService> {
  $$__service_name__$$ = 'LegalRuleService';

  law!: string;
  lawStartDate!: string;
  articleNumber!: number;
  legalTextArabic!: string;
  legalTextEnglish!: string;
  override status: number = 1;

  buildForm(controls = false): object {
    const {
      enName,
      arName,
      law,
      lawStartDate,
      articleNumber,
      legalTextArabic,
      legalTextEnglish,
      status,
    } = this;
    return {
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
      law: controls ? [law] : law,
      lawStartDate: controls ? [lawStartDate] : lawStartDate,
      articleNumber: controls ? [articleNumber] : articleNumber,
      legalTextArabic: controls
        ? [legalTextArabic, [CustomValidators.required]]
        : legalTextArabic,
      legalTextEnglish: controls
        ? [legalTextEnglish, [CustomValidators.pattern('ENG_NUM')]]
        : legalTextEnglish,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
