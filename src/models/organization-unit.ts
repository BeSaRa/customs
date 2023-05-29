import { BaseModel } from '@abstracts/base-model';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { OrganizationUnitInterceptor } from '@model-interceptors/organization-unit-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { Team } from './team';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';

const { send, receive } = new OrganizationUnitInterceptor();

@InterceptModel({ send, receive })
export class OrganizationUnit extends BaseModel<OrganizationUnit, OrganizationUnitService> {
  $$__service_name__$$ = 'OrganizationUnitService';
  override status = StatusTypes.ACTIVE;

  type!: number;
  typeInfo!: AdminResult;

  code!: string;
  email!: string;
  ldapGroupName!: string;
  ldapLimitedGroupName!: string;

  managerId!: number;
  managerInfo!: AdminResult;

  parent!: number;
  parentInfo!: AdminResult;

  buildForm(controls = false): object {
    const { arName, enName, code, email, type, managerId, ldapGroupName, ldapLimitedGroupName, parent, status } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      code: controls ? [code, CustomValidators.required] : code,
      type: controls ? [type, CustomValidators.required] : type,
      managerId: controls ? [managerId, CustomValidators.required] : managerId,
      parent: controls ? [parent, CustomValidators.required] : parent,
      email: controls ? [email, CustomValidators.required] : email,
      ldapGroupName: controls ? [ldapGroupName, CustomValidators.required] : ldapGroupName,
      ldapLimitedGroupName: controls ? [ldapLimitedGroupName, CustomValidators.required] : ldapLimitedGroupName,

      status: status,
    };
  }
}
