import { Injectable } from '@angular/core';
import { UserGuide } from '@models/user-guide';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { UserGuidePopupComponent } from '@modules/administration/popups/user-guide-popup/user-guide-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
    
@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => UserGuide,
    },
  },
  $default: {
    model: () => UserGuide,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserGuideService extends BaseCrudWithDialogService<
UserGuidePopupComponent,
UserGuide> {
  serviceName = 'UserGuideService';
  protected getModelClass(): Constructor<UserGuide> {
    return UserGuide;
  }

  protected getModelInstance(): UserGuide {
    return new UserGuide();
  }

  getDialogComponent(): ComponentType<UserGuidePopupComponent> {
    return UserGuidePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_GUIDE;
  }
}
