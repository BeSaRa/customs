import { BaseModel } from '@abstracts/base-model';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { OrganizationUnitInterceptor } from '@model-interceptors/organization-unit-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { StatusTypes } from '@enums/status-types';

const { send, receive } = new OrganizationUnitInterceptor();

@InterceptModel({ send, receive })
export class OrganizationUnit extends BaseModel<
  OrganizationUnit,
  OrganizationUnitService
> {
  $$__service_name__$$ = 'OrganizationUnitService';
  override status = StatusTypes.ACTIVE;

  type!: number;
  code!: string;
  email!: string;
  ldapGroupName!: string;
  ldapLimitedGroupName!: string;
  managerId!: number;
  parent!: number;
  mawaredDepId!: number;
  assistantOuId!: number;
  managerAssistant!: number;
  typeInfo!: AdminResult;
  parentInfo!: AdminResult;
  managerInfo!: AdminResult;
  mawaredDepInfo!: AdminResult;
  assistantInfo!: AdminResult;
  isCustoms!: number;

  buildForm(controls = false): object {
    const {
      arName,
      enName,
      email,
      type,
      managerId,
      mawaredDepId,
      assistantOuId,
      managerAssistant,
      parent,
      isCustoms,
      status,
    } = this;
    return {
      arName: controls
        ? [
            arName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('AR_NUM'),
            ],
          ]
        : arName,
      enName: controls
        ? [
            enName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('ENG_NUM'),
            ],
          ]
        : enName,
      type: controls ? [type, CustomValidators.required] : type,
      managerId: controls ? [managerId, CustomValidators.required] : managerId,
      parent: controls ? [parent, CustomValidators.required] : parent,
      email: controls ? [email, CustomValidators.required] : email,
      mawaredDepId: controls
        ? [mawaredDepId, CustomValidators.required]
        : mawaredDepId,
      assistantOuId: controls
        ? [assistantOuId, CustomValidators.required]
        : assistantOuId,
      managerAssistant: controls
        ? [managerAssistant, CustomValidators.required]
        : managerAssistant,
      isCustoms: controls ? [isCustoms, CustomValidators.required] : isCustoms,

      status: status,
    };
  }
}
