import { Injectable } from '@angular/core';
import { InternalUserOU } from '@models/internal-user-ou';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { InternalUserOUPopupComponent } from '@modules/administration/popups/internal-user-ou-popup/internal-user-ou-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => InternalUserOU,
    },
  },
  $default: {
    model: () => InternalUserOU,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InternalUserOUService extends BaseCrudWithDialogService<InternalUserOUPopupComponent, InternalUserOU> {
  serviceName = 'InternalUserOUService';
  protected getModelClass(): Constructor<InternalUserOU> {
    return InternalUserOU;
  }

  protected getModelInstance(): InternalUserOU {
    return new InternalUserOU();
  }

  getDialogComponent(): ComponentType<InternalUserOUPopupComponent> {
    return InternalUserOUPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.INTERNAL_USER_OU;
  }
}
