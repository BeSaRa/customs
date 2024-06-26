import { Injectable } from '@angular/core';
import { ManagerDelegation } from '@models/manager-delegation';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ManagerDelegationPopupComponent } from '@modules/administration/popups/manager-delegation-popup/manager-delegation-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { InternalUser } from '@models/internal-user';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ManagerDelegation,
    },
  },
  $default: {
    model: () => ManagerDelegation,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ManagerDelegationService extends BaseCrudWithDialogService<
  ManagerDelegationPopupComponent,
  ManagerDelegation
> {
  serviceName = 'ManagerDelegationService';

  protected getModelClass(): Constructor<ManagerDelegation> {
    return ManagerDelegation;
  }

  protected getModelInstance(): ManagerDelegation {
    return new ManagerDelegation();
  }

  getDialogComponent(): ComponentType<ManagerDelegationPopupComponent> {
    return ManagerDelegationPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.MANAGER_DELEGATION;
  }

  @CastResponse(() => InternalUser)
  loadManagers() {
    return this.http.get<InternalUser[]>(
      this.getUrlSegment() + '/admin/manager',
    );
  }

  cancelDelegated(id: number) {
    return this.http.put<number>(
      `${this.getUrlSegment()}/admin/${id}/cancel-delegate`,
      { id },
    );
  }
}
