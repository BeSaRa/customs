import { inject, Injectable } from '@angular/core';
import { LoginDataContract } from '@contracts/login-data-contract';
import { InternalUser } from '@models/internal-user';
import { Permission } from '@models/permission';
import { LookupService } from '@services/lookup.service';
import { AppPermissionsType } from '@constants/app-permissions';
import { OrganizationUnit } from '@models/organization-unit';
import { Team } from '@models/team';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  private loginData?: LoginDataContract;
  private readonly permissionMap = new Map<keyof AppPermissionsType, Permission>();
  private readonly lookupService = inject(LookupService);

  setLoginData(data: LoginDataContract): LoginDataContract {
    this.loginData = this.intercept(data);

    return this.loginData;
  }

  private intercept(data: LoginDataContract): LoginDataContract {
    data.internalUser = new InternalUser().clone<InternalUser>({
      ...data.internalUser,
    });
    // set the lookup after login
    data.lookupMap = this.lookupService.setLookups(data.lookupMap);
    // generate the permissions list
    this.generatePermissionMap(data.permissionSet);

    // set user teams
    data.teams = data.teams.map((item: Team) => {
      const nTeam = new Team();
      nTeam.id = item.id;
      nTeam.arName = item.arName;
      nTeam.enName = item.enName;
      return nTeam;
    });
    // add static team called all with id -1 to load all teams items
    if (data.teams.length) {
      const team = new Team();
      team.id = -1;
      team.arName = 'الكل';
      team.enName = 'All';
      // team.clone({
      //   arName: 'الكل',
      //   enName: 'All',
      //   id: -1,
      // });
      data.teams = [team, ...data.teams];
    }
    return data;
  }

  private generatePermissionMap(permissionSet: Permission[]) {
    this.permissionMap.clear();
    permissionSet.forEach(permission => {
      this.permissionMap.set(permission.permissionKey, permission);
    });
  }

  /**
   * @description has permission to do something
   * @param permission the given permission to check
   */
  hasPermissionTo(permission: keyof AppPermissionsType): boolean {
    return this.permissionMap.has(permission);
  }

  /**
   * @description has Any permission to the given list means, at least one permission of the provided list to be exists to return true
   * @param permissions
   */
  hasAnyPermissions(permissions: (keyof AppPermissionsType)[]): boolean {
    return permissions.some(permission => {
      return this.permissionMap.has(permission);
    });
  }

  /**
   * @description to check all permissions provided to the method if all exists will return true, else false
   * @param permissions
   */
  hasAllPermissions(permissions: (keyof AppPermissionsType)[]): boolean {
    return !permissions.some(permission => {
      return !this.permissionMap.has(permission);
    });
  }

  getEmployee(): InternalUser | undefined {
    return this.loginData?.internalUser;
  }
  getEmployeeTeams(): Team[] {
    console.log(this.loginData?.teams);
    return this.loginData?.teams || [];
  }
  clearEmployee() {
    this.loginData = undefined;
  }

  getOrganizationUnit(): OrganizationUnit | undefined {
    return this.loginData?.organizationUnit;
  }
}
