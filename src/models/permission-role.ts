import { BaseModel } from '@abstracts/base-model';
import { PermissionRoleService } from '@services/permission-role.service';
import { PermissionRoleInterceptor } from '@model-interceptors/permission-role-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new PermissionRoleInterceptor();

@InterceptModel({ send, receive })
export class PermissionRole extends BaseModel<
  PermissionRole,
  PermissionRoleService
> {
  $$__service_name__$$ = 'PermissionRoleService';
  description!: string;
  permissionSet: { id?: number; permissionId: number }[] = [];
  // override status = 1;

  buildForm(controls = false): object {
    const { arName, enName, description, status } = this;
    return {
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      description: controls ? [description] : description,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }
}
