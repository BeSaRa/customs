import { Injectable } from '@angular/core';
import { Services } from '@models/services';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ServicesPopupComponent } from '@modules/administration/popups/services-popup/services-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
    
@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Services,
    },
  },
  $default: {
    model: () => Services,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ServicesService extends BaseCrudWithDialogService<
ServicesPopupComponent,
Services> {
  serviceName = 'ServicesService';
  protected getModelClass(): Constructor<Services> {
    return Services;
  }

  protected getModelInstance(): Services {
    return new Services();
  }

  getDialogComponent(): ComponentType<ServicesPopupComponent> {
    return ServicesPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.SERVICES;
  }
}
