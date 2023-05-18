import { BaseModel } from '@abstracts/base-model';
import { PermissionRoleService } from '@services/permission-role.service';
import { PermissionRoleInterceptor } from '@model-interceptors/permission-role-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new PermissionRoleInterceptor();

@InterceptModel({ send, receive })
export class PermissionRole extends BaseModel<
  PermissionRole,
  PermissionRoleService
> {
  $$__service_name__$$ = 'PermissionRoleService';

  buildForm(controls = false): object {
    return {};
  }
}
