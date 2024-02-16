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
  linkedPid!: number;
  statusDateModified?: Date | string;
  ouId!: number;
  agentCustomCode!: string;
  attachmentCount: number = 0;
  offenderInfo?: MawaredEmployee | ClearingAgent;
  violations: OffenderViolation[] = [];
  offenderOUInfo?: AdminResult;
  customsViolationEffectInfo?: AdminResult;
  clearingAgencyInfo!: AdminResult;
  typeInfo!: AdminResult;
  penaltyInfo!: AdminResult;
  agencyInfo!: AdminResult;

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
    return (
      (this.type === OffenderTypes.BOTH &&
        this.$$getEmployeeService$$().hasAnyPermissions([
          'EMPLOYEE_SITUATION_SEARCH_IN_ALL_DEPARTMENTS',
          'EMPLOYEE_SITUATION_SEARCH_IN_DEPARTMENT',
          'CLEARING_AGENT_SITUATION_SEARCH',
        ])) ||
      (this.type === OffenderTypes.EMPLOYEE &&
        this.$$getEmployeeService$$().hasAnyPermissions([
          'EMPLOYEE_SITUATION_SEARCH_IN_ALL_DEPARTMENTS',
          'EMPLOYEE_SITUATION_SEARCH_IN_DEPARTMENT',
        ])) ||
      (this.type === OffenderTypes.BROKER &&
        this.$$getEmployeeService$$().hasPermissionTo(
          'CLEARING_AGENT_SITUATION_SEARCH',
        ))
    );
  }
}
