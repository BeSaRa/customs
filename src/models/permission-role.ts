import { BaseModel } from '@abstracts/base-model';
import { PermissionRoleService } from '@services/permission-role.service';
import { PermissionRoleInterceptor } from '@model-interceptors/permission-role-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new PermissionRoleInterceptor();

@InterceptModel({ send, receive })
export class PermissionRole extends BaseModel<PermissionRole, PermissionRoleService> {
  $$__service_name__$$ = 'PermissionRoleService';
  description!: string;
  permissionSet: { id?: number; permissionId: number }[] = [];
  override status: number = this.status ? this.status : 1;
  buildForm(controls = false): object {
    const { arName, enName, description, status } = this;
    return {
      arName: controls ? [arName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_NUM')]] : arName,
      enName: controls ? [enName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_NUM')]] : enName,
      description: controls ? [description] : description,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
