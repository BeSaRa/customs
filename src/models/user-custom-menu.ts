import { UserCustomMenuInterceptor } from '@model-interceptors/user-custom-menu-Interceptor';
import { BaseModel } from '@abstracts/base-model';
import { InterceptModel } from 'cast-response';
import { UserCustomMenuService } from '@services/user-custom-menu-service';

const { send, receive } = new UserCustomMenuInterceptor();

@InterceptModel({ send, receive })
export class UserCustomMenu extends BaseModel<
  UserCustomMenu,
  UserCustomMenuService
> {
  override $$__service_name__$$: string = 'UserCustomMenuService';
  internalUserId!: number;
  menuItemId!: number;
}
