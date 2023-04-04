import { BasModel } from '@abstracts/bas-model';
import { LocalizationService } from '@services/localization.service';

export class Localization extends BasModel<Localization, LocalizationService> {
  $$__service_name__$$ = 'LocalizationService';
  localizationKey!: string;
  module!: number;
}
