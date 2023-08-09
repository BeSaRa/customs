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

  buildForm(controls = false): object {
    const { enName, arName, law, lawStartDate, articleNumber, legalTextArabic, legalTextEnglish, status } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      law: controls ? [law, CustomValidators.required] : law,
      lawStartDate: controls ? [lawStartDate, CustomValidators.required] : lawStartDate,
      articleNumber: controls ? [articleNumber, CustomValidators.required] : articleNumber,
      legalTextArabic: controls ? [legalTextArabic, CustomValidators.required] : legalTextArabic,
      legalTextEnglish: controls ? [legalTextEnglish, CustomValidators.required] : legalTextEnglish,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
