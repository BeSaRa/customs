import { ModelInterceptorContract } from 'cast-response';
import { PermissionRole } from '@models/permission-role';

export class PermissionRoleInterceptor
  implements ModelInterceptorContract<PermissionRole>
{
  send(model: Partial<PermissionRole>): Partial<PermissionRole> {
    return model;
  }

  receive(model: PermissionRole): PermissionRole {
    return model;
  }
}
