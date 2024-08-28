import { BaseModel } from '@abstracts/base-model';
import { OffenderService } from '@services/offender.service';
import { AdminResult } from '@models/admin-result';
import { InterceptModel } from 'cast-response';
import { OffenderInterceptor } from '@model-interceptors/offender-interceptor';
import { OffenderViolation } from './offender-violation';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { OffenderTypes } from '@enums/offender-types';
import { EmployeeService } from '@services/employee.service';
import { ServiceRegistry } from '@services/service-registry';

const { send, receive } = new OffenderInterceptor();

@InterceptModel({ send, receive })
export class Offender extends BaseModel<Offender, OffenderService> {
  $$__service_name__$$ = 'OffenderService';
  $$__employeeService__$$ = 'EmployeeService';
  caseId!: string;
  offenderRefId!: number;
  type!: number;
  clearingAgencyId!: number;
  customsViolationEffect!: number;
  penaltyId!: number;
  decisionSerial!: string;
  isCash!: boolean;
  linkedPid!: number;
  statusDateModified?: Date | string;
  ouId!: number;
  employeeDepartmentId!: number;
  agentCustomCode!: string;
  attachmentCount: number = 0;
  decisionType!: number;
  offenderInfo?: MawaredEmployee | ClearingAgent;
  violations: OffenderViolation[] = [];
  offenderOUInfo?: AdminResult;
  customsViolationEffectInfo?: AdminResult;
  clearingAgencyInfo!: AdminResult;
  typeInfo!: AdminResult;
  penaltyInfo!: AdminResult;
  agencyInfo!: AdminResult;
  penaltySignerInfo!: AdminResult;
  penaltySignerRoleInfo!: AdminResult;
  penaltyStatusInfo!: AdminResult;
  penaltyStatus!: number;
  directedToInfo!: AdminResult;
  decisionTypeInfo!: AdminResult;
  penaltySignerId!: number;
  penaltyAppliedDate!: string;
  hasRunningGrievance!: number;
  vsid!: string;

  override getNames(): string {
    return this.offenderInfo?.getNames() || '';
  }

  $$getEmployeeService$$(): EmployeeService {
    return ServiceRegistry.get<EmployeeService>(this.$$__employeeService__$$);
  }

  hasStatusSearch(isCompany: boolean = false) {
    if (isCompany) {
      return (
        this.type === OffenderTypes.BROKER &&
        this.$$getEmployeeService$$().hasPermissionTo(
          'CLEARING_AGENCY_SITUATION_SEARCH',
        )
      );
    }
    let employeeDepartmentId;
    if (this.type === OffenderTypes.EMPLOYEE) {
      employeeDepartmentId = this.employeeDepartmentId
        ? this.employeeDepartmentId
        : (this.offenderInfo as MawaredEmployee).employeeDepartmentId;
    }
    return (
      (this.type === OffenderTypes.BROKER &&
        this.$$getEmployeeService$$().hasPermissionTo(
          'CLEARING_AGENT_SITUATION_SEARCH',
        )) ||
      (this.type === OffenderTypes.EMPLOYEE &&
        this.$$getEmployeeService$$().hasPermissionTo(
          'EMPLOYEE_SITUATION_SEARCH_IN_ALL_DEPARTMENTS',
        )) ||
      (this.type === OffenderTypes.EMPLOYEE &&
        this.$$getEmployeeService$$().hasPermissionTo(
          'EMPLOYEE_SITUATION_SEARCH_IN_DEPARTMENT',
        ) &&
        this.$$getEmployeeService$$().getEmployee()?.mawaredEmployeeInfo
          .employeeDepartmentId === employeeDepartmentId)
    );
  }

  getDepartmentCompanyNames(): string {
    return this.type === OffenderTypes.EMPLOYEE
      ? this.offenderOUInfo?.getNames() || ''
      : (this.offenderInfo as ClearingAgent).getCompanyName();
  }

  isEmployee(item: Offender['offenderInfo']): item is MawaredEmployee {
    return item?.type === OffenderTypes.EMPLOYEE;
  }

  getJobGrade(): string {
    return this.offenderInfo && this.isEmployee(this.offenderInfo)
      ? this.offenderInfo.employeeCareerLevelInfo.getNames()
      : 'N/A';
  }
}
