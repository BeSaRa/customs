import { Injectable } from '@angular/core';
import { Localization } from '@models/localization';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { LocalizationPopupComponent } from '@modules/administration/popups/localization-popup/localization-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Localization,
    },
  },
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
  protected getModelClass(): Constructor<Localization> {
    return Localization;
  }

  protected getModelInstance(): Localization {
    return new Localization();
  }

  getDialogComponent(): ComponentType<LocalizationPopupComponent> {
    return LocalizationPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LOCALIZATION;
  }
}
