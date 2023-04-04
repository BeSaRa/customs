import { Injectable } from '@angular/core';
import { Localization } from '@models/localization';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $default: {
    model: () => Localization,
  },
})
@Injectable({
  providedIn: 'root',
})
export class LocalizationService extends BaseCrudService<Localization> {
  constructor() {
    super();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LOCALIZATION;
  }
}
