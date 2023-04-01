import { inject, Injectable } from '@angular/core';
import { LoginDataContract } from '@contracts/login-data-contract';
import { InternalUser } from '@models/internal-user';
import { Permission } from '@models/permission';
import { LookupService } from '@services/lookup.service';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private loginData?: LoginDataContract;
  private readonly permissionMap = new Map<string, Permission>();
  private readonly lookupService = inject(LookupService);

  setLoginData(data: LoginDataContract): LoginDataContract {
    this.loginData = this.intercept(data);
    return this.loginData;
  }

  private intercept(data: LoginDataContract): LoginDataContract {
    data.internalUser = new InternalUser().clone({
      ...data.internalUser,
    });
    // set the lookup after login
    data.lookupMap = this.lookupService.setLookups(data.lookupMap);
    // generate the permissions list
    this.generatePermissionMap(data.permissionSet);
    return data;
  }

  private generatePermissionMap(permissionSet: Permission[]) {
    this.permissionMap.clear();
    permissionSet.forEach((permission) => {
      this.permissionMap.set(permission.permissionKey, permission);
    });
  }
}
