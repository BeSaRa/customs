import { Injectable } from '@angular/core';
import { Localization } from '@models/localization';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { LocalizationPopupComponent } from '@modules/administration/popups/localization-popup/localization-popup.component';

@CastResponseContainer({
  $default: {
    model: () => Localization,
  },
})
@Injectable({
  providedIn: 'root',
})
export class LocalizationService extends BaseCrudWithDialogService<
  LocalizationPopupComponent,
  Localization
> {
  getDialogComponent(): ComponentType<LocalizationPopupComponent> {
    return LocalizationPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LOCALIZATION;
  }

  getModelInstance(): Localization {
    return new Localization();
  }
}
