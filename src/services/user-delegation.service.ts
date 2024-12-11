import { Injectable } from '@angular/core';
import { UserDelegation } from '@models/user-delegation';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { UserDelegationPopupComponent } from '@modules/administration/popups/user-delegation-popup/user-delegation-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
    
@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => UserDelegation,
    },
  },
  $default: {
    model: () => UserDelegation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserDelegationService extends BaseCrudWithDialogService<
UserDelegationPopupComponent,
UserDelegation> {
  serviceName = 'UserDelegationService';
  protected getModelClass(): Constructor<UserDelegation> {
    return UserDelegation;
  }

  protected getModelInstance(): UserDelegation {
    return new UserDelegation();
  }

  getDialogComponent(): ComponentType<UserDelegationPopupComponent> {
    return UserDelegationPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_DELEGATION;
  }
}
