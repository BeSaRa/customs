import { inject, Injectable } from '@angular/core';
import { LoginDataContract } from '@contracts/login-data-contract';
import { InternalUser } from '@models/internal-user';
import { Permission } from '@models/permission';
import { LookupService } from '@services/lookup.service';
import { AppPermissionsType } from '@constants/app-permissions';
import { OrganizationUnit } from '@models/organization-unit';
import { Team } from '@models/team';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { ServiceContract } from '@contracts/service-contract';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { InternalUserInterceptor } from '@model-interceptors/internal-user-interceptor';
import { ClearingAgency } from '@models/clearing-agency';
import { UserTypes } from '@enums/user-types';
import { TeamNames } from '@enums/team-names';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { ClearingAgentInterceptor } from '@model-interceptors/clearing-agent-interceptor';
import { ClearingAgencyInterceptor } from '@model-interceptors/clearing-agency-interceptor';

const internalUserInterceptor = new InternalUserInterceptor();
const mawaredEmployeeInterceptor = new MawaredEmployeeInterceptor();
const clearingAgentInterceptor = new ClearingAgentInterceptor();
const clearingAgencyInterceptor = new ClearingAgencyInterceptor();

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

  get loggedInUserId(): number | undefined {
    return this.getLoginData()?.type === UserTypes.EXTERNAL_CLEARING_AGENCY
      ? this.getExternalClearingAgency()?.id
      : this.getLoginData()?.type === UserTypes.INTERNAL
        ? this.getEmployee()?.id
        : this.getExternalPerson()?.id;
  }

  private intercept(data: LoginDataContract): LoginDataContract {
    data.internalUser &&
      (data.internalUser = internalUserInterceptor.receive(
        new InternalUser().clone<InternalUser>({
          ...data.internalUser,
        }),
      ));

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

    if (data.type === UserTypes.EXTERNAL_EMPLOYEE) {
      data.person = mawaredEmployeeInterceptor.receive(
        new MawaredEmployee().clone<MawaredEmployee>({
          ...(data.person as MawaredEmployee),
        }),
      );
    }

    if (data.type === UserTypes.EXTERNAL_CLEARING_AGENT) {
      data.person = clearingAgentInterceptor.receive(
        new ClearingAgent().clone<ClearingAgent>({
          ...(data.person as ClearingAgent),
        }),
      );
    }

    data.clearingAgency &&
      (data.clearingAgency = clearingAgencyInterceptor.receive(
        new ClearingAgency().clone<ClearingAgency>({
          ...(data.clearingAgency as ClearingAgency),
        }),
      ));
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

  hasPermissionFromTeam(teamName: TeamNames): boolean {
    return !!this.getEmployeeTeams().find((t: Team) => t.authName === teamName);
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

  isExternal() {
    const _type = this.getLoginData()?.type;
    return (
      _type === UserTypes.EXTERNAL_CLEARING_AGENCY ||
      _type === UserTypes.EXTERNAL_CLEARING_AGENT ||
      _type === UserTypes.EXTERNAL_EMPLOYEE
    );
  }

  isApplicantUser() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Applicant_Department,
    );
  }

  isApplicantChief() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Applicant_Department_Chief,
    );
  }

  isApplicantManager() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Applicant_Department_Manager,
    );
  }

  isHrManager() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Human_Resources_Manager,
    );
  }

  isInvestigator() {
    return !!(this.loginData?.teams || []).find(
      (t: Team) =>
        t.authName === TeamNames.Investigator ||
        t.authName === TeamNames.Investigation_Chief,
    );
  }

  isHumanResourceTeam() {
    return !!(this.loginData?.teams || []).find(
      (t: Team) =>
        t.authName === TeamNames.Human_Resources_Manager ||
        t.authName === TeamNames.Human_Resources,
    );
  }

  isCustomsAffairsManager() {
    return !!(this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Customs_Affairs_Manager,
    );
  }

  isLegalAffairsManager() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Legal_Affairs_Manager,
    );
  }

  isLegalAffairsOrInvestigatorOrInvestigatorChief() {
    return (this.loginData?.teams || []).find(
      (t: Team) =>
        t.authName === TeamNames.Legal_Affairs_Manager ||
        t.authName === TeamNames.Investigator ||
        t.authName === TeamNames.Investigation_Chief,
    );
  }

  isDisciplinaryCommittee() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Disciplinary_Committee,
    );
  }

  isOneOfLegalAffairsTeams() {
    return !!(this.loginData?.teams || []).find(
      (t: Team) =>
        t.authName === TeamNames.Legal_Affairs ||
        t.authName === TeamNames.Legal_Affairs_Manager ||
        t.authName === TeamNames.Investigator ||
        t.authName === TeamNames.Investigation_Chief,
    );
  }

  // isTeamSecretary(ldapGroupName: LDAPGroupNames) {
  //   const customSettings: string | undefined = (
  //     this.loginData?.teams || []
  //   ).find((t: Team) => t.ldapGroupName === ldapGroupName)?.customSettings;
  //
  //   const parsedCustomSettings: Partial<DisciplinaryCommitteeCustomSettingContract> =
  //     JSON.parse(
  //       (customSettings as string) || '{}',
  //     ) as DisciplinaryCommitteeCustomSettingContract;
  //   return parsedCustomSettings.secretary === this.getEmployee()?.id;
  // }

  // isTeamPresident(ldapGroupName: LDAPGroupNames) {
  //   const customSettings: string | undefined = (
  //     this.loginData?.teams || []
  //   ).find((t: Team) => t.ldapGroupName === ldapGroupName)?.customSettings;
  //
  //   const parsedCustomSettings: Partial<DisciplinaryCommitteeCustomSettingContract> =
  //     JSON.parse(
  //       (customSettings as string) || '{}',
  //     ) as DisciplinaryCommitteeCustomSettingContract;
  //   return parsedCustomSettings.president === this.getEmployee()?.id;
  // }

  isPermanentDisciplinaryCommittee() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.Permanent_Disciplinary_Committee,
    );
  }

  isPresidentAssisstant() {
    return (this.loginData?.teams || []).find(
      (t: Team) =>
        t.authName === TeamNames.President_Assistant ||
        t.authName === TeamNames.CA_President_Assistant,
    );
  }

  isPresidentAssistantOffice() {
    return !!(this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.President_Assistant_Office,
    );
  }

  isPresident() {
    return (this.loginData?.teams || []).find(
      (t: Team) => t.authName === TeamNames.President,
    );
  }

  getEmployee(): InternalUser | undefined {
    return this.loginData?.internalUser;
  }

  getExternalPerson(): MawaredEmployee | ClearingAgent | undefined {
    return this.loginData?.person;
  }

  getExternalClearingAgency(): ClearingAgency | undefined {
    return this.loginData?.clearingAgency;
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
