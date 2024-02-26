import { inject, Injectable } from '@angular/core';
import { LoginDataContract } from '@contracts/login-data-contract';
import { InternalUser } from '@models/internal-user';
import { Permission } from '@models/permission';
import { LookupService } from '@services/lookup.service';
import { AppPermissionsType } from '@constants/app-permissions';
import { OrganizationUnit } from '@models/organization-unit';
import { Team } from '@models/team';
import { LDAPGroupNames } from '@enums/department-group-names.enum';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { ServiceContract } from '@contracts/service-contract';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { WitnessTypes } from '@enums/witness-types';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService
  extends RegisterServiceMixin(class {})
  implements ServiceContract
{
  serviceName = 'EmployeeService';
  private loginData?: LoginDataContract;
  private readonly permissionMap = new Map<
    keyof AppPermissionsType,
    Permission
  >();
  private readonly lookupService = inject(LookupService);

  getLoginData() {
    return this.loginData;
  }
  setLoginData(data: LoginDataContract): LoginDataContract {
    this.loginData = this.intercept(data);

    return this.loginData;
  }
  private intercept(data: LoginDataContract): LoginDataContract {
    data.internalUser &&
      (data.internalUser = new InternalUser().clone<InternalUser>({
        ...data.internalUser,
      }));

    data.organizationUnits = (data.organizationUnits || []).map(item => {
      return new OrganizationUnit().clone<OrganizationUnit>(item);
    });
    data.organizationUnit = new OrganizationUnit().clone<OrganizationUnit>(
      data.organizationUnit,
    );
    // set the lookup after login
    data.lookupMap = this.lookupService.setLookups(data.lookupMap);
    // generate the permissions list
    this.generatePermissionMap(data.permissionSet);
    if (data.person && data.person.type === WitnessTypes.EMPLOYEE) {
      data.person = new MawaredEmployee().clone<MawaredEmployee>({
        ...(data.person as MawaredEmployee),
      });
    }
    if (data.person && data.type === WitnessTypes.ClEARING_AGENT) {
      data.person = new ClearingAgent().clone<ClearingAgent>({
        ...(data.person as ClearingAgent),
      });
    }
    // set user teams
    data.teams = (data.teams || []).map((item: Team) =>
      new Team().clone<Team>(item),
    );
    // add static team called all with id -1 to load all teams items
    if (data.teams.length) {
      const team = new Team().clone<Team>({
        arName: 'الكل',
        enName: 'All',
        id: -1,
      });
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

  isApplicantUser() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.ldapGroupName === LDAPGroupNames.Applicant_Department,
    );
  }

  isApplicantChief() {
    return (this.loginData?.teams || []).find(
      (t: Team) =>
        t.ldapGroupName === LDAPGroupNames.Applicant_Department_Chief,
    );
  }

  isApplicantManager() {
    return (this.loginData?.teams || []).find(
      (t: Team) =>
        t.ldapGroupName === LDAPGroupNames.Applicant_Department_Manager,
    );
  }

  isHrManager() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.ldapGroupName === LDAPGroupNames.Human_Resources_Manager,
    );
  }

  isDisciplinaryCommittee() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.ldapGroupName === LDAPGroupNames.Disciplinary_Committee,
    );
  }

  isPermanentDisciplinaryCommittee() {
    return (this.loginData?.teams || []).find(
      (t: Team) =>
        t.ldapGroupName === LDAPGroupNames.Permanent_Disciplinary_Committee,
    );
  }

  getEmployee(): InternalUser | undefined {
    return this.loginData?.internalUser;
  }

  getEmployeeTeams(): Team[] {
    return this.loginData?.teams || [];
  }

  clearEmployee() {
    this.loginData = undefined;
  }

  getOrganizationUnit(): OrganizationUnit | undefined {
    return this.loginData?.organizationUnit;
  }

  getOrganizationUnits(): OrganizationUnit[] {
    return this.loginData ? this.loginData.organizationUnits : [];
  }
}
