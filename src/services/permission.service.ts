import { Injectable } from '@angular/core';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Permission } from '@models/permission';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { map, Observable, tap } from 'rxjs';
import { Constructor } from '@app-types/constructors';
import { ResponseContract } from '@contracts/response-contract';

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

  getUrlSegmentUserPermission(): string {
    return this.urlService.URLS.USER_PERMISSION;
  }

  @CastResponse(() => Permission)
  private _loadUserPermissions(userId: number): Observable<Permission[]> {
    return this.http.get<Permission[]>(this.getUrlSegmentUserPermission() + '/internal/' + userId);
  }

  private _savePermissions(userId: number, permissions: number[]): Observable<ResponseContract<number>> {
    return this.http.post<ResponseContract<number>>(this.getUrlSegmentUserPermission() + '/' + userId + '/bulk', permissions);
  }

  savePermissions(userId: number, permissions: number[]): Observable<ResponseContract<number>> {
    return this._savePermissions(userId, permissions);
  }

  loadUserPermissions(userId: number): Observable<Permission[]> {
    return this._loadUserPermissions(userId);
  }

  /**
   * @description to dev environment to print the content to AppPermissions Constant
   */
  generateAppPermission(): Observable<Record<string, string>> {
    return this.loadAsLookups().pipe(
      map(items => {
        return items.reduce((acc, permission) => {
          return {
            ...acc,
            [permission.permissionKey]: permission.permissionKey,
          };
        }, {} as Record<string, string>);
      }),
      tap(values => {
        let content = '';
        Object.keys(values).forEach(item => {
          content += `\n${item}:'${item}',`;
        });
        console.log(content);
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
