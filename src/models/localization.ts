import { BaseModel } from '@abstracts/base-model';
import { LocalizationService } from '@services/localization.service';

export class Localization extends BaseModel<Localization, LocalizationService> {
  $$__service_name__$$ = 'LocalizationService';
  localizationKey!: string;
  module!: number;
}
