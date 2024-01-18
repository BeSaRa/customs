import { BaseModel } from '@abstracts/base-model';
import { LocalizationService } from '@services/localization.service';
import { LocalizationInterceptor } from '@model-interceptors/localization-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new LocalizationInterceptor();

@InterceptModel({
  send,
  receive,
})
export class Localization extends BaseModel<Localization, LocalizationService> {
  $$__service_name__$$ = 'LocalizationService';
  localizationKey!: string;
  module!: number;

  buildForm(controls = false): object {
    const { localizationKey, arName, enName } = this;
    return {
      localizationKey: controls
        ? [localizationKey, CustomValidators.required]
        : localizationKey,
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
    };
  }
}
