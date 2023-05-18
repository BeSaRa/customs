import { Injectable } from '@angular/core';
import { PermissionRole } from '@models/permission-role';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { PermissionRolePopupComponent } from '@modules/administration/popups/permission-role-popup/permission-role-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => PermissionRole,
    },
  },
  $default: {
    model: () => PermissionRole,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PermissionRoleService extends BaseCrudWithDialogService<
  PermissionRolePopupComponent,
  PermissionRole
> {
  serviceName = 'PermissionRoleService';

  protected getModelClass(): Constructor<PermissionRole> {
    return PermissionRole;
  }

  protected getModelInstance(): PermissionRole {
    return new PermissionRole();
  }

  getDialogComponent(): ComponentType<PermissionRolePopupComponent> {
    return PermissionRolePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.PERMISSION_ROLE;
  }
}
