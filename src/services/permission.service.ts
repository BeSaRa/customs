import { Injectable } from '@angular/core';
import { BaseCrudService } from '@abstracts/base-crud-service';
import { Permission } from '@models/permission';
import { CastResponseContainer } from 'cast-response';
import { map, Observable, tap } from 'rxjs';
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
  models: Permission[] = [];

  protected getUrlSegment(): string {
    return this.urlService.URLS.PERMISSION;
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
      }),
      tap((map) => {
        printConstantContent && console.log(JSON.stringify(map, null, '  '));
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
