import { ModelInterceptorContract } from 'cast-response';
import { Localization } from '@models/localization';

export class LocalizationInterceptor
  implements ModelInterceptorContract<Localization>
{
  send(model: Partial<Localization>): Partial<Localization> {
    model.localizationKey &&= model.localizationKey?.toLocaleLowerCase();
    return model;
  }

  receive(model: Localization): Localization {
    return model;
  }
}
