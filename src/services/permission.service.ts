import { Injectable } from '@angular/core';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Permission } from '@models/permission';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { map, Observable } from 'rxjs';
import { Constructor } from '@app-types/constructors';

@CastResponseContainer({
  $default: {
    model: () => Permission,
  },
})
@Injectable({
  providedIn: 'root',
})
export class PermissionService extends BaseCrudService<Permission> {
  serviceName = 'PermissionService';
  models: Permission[] = [];

  protected getUrlSegment(): string {
    return this.urlService.URLS.PERMISSION;
  }
  getUrlSegmentUserPreferences(): string {
    return this.urlService.URLS.USER_PREFERENCES;
  }

  @CastResponse(() => Permission)
  private _loadPermissions(userId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(
      this.getUrlSegmentUserPreferences() + '/internal/' + userId
    );
  }

  private _savePermissions(
    userId: number,
    permissions: number[]
  ): Observable<any> {
    return this.http.post(
      this.getUrlSegmentUserPreferences() + '/' + userId + '/bulk',
      permissions
    );
  }

  savePermissions(userId: number, permissions: number[]): Observable<any> {
    return this._savePermissions(userId, permissions);
  }

  loadPermissions(userId: number): Observable<Permission[]> {
    return this._loadPermissions(userId);
  }

  /**
   * @description to dev environment to print the content to AppPermissions Constant
   * @param printConstantContent
   */
  generateAppPermission(
    printConstantContent = true
  ): Observable<Record<string, string>> {
    return this.loadAsLookups().pipe(
      map((items) => {
        return items.reduce((acc, permission) => {
          return {
            ...acc,
            [permission.permissionKey]: permission.permissionKey,
          };
        }, {} as Record<string, string>);
      })
    );
  }

  protected getModelInstance(): Permission {
    return new Permission();
  }

  protected getModelClass(): Constructor<Permission> {
    return Permission;
  }
}
