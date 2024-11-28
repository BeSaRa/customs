import { ModelInterceptorContract } from 'cast-response';
import { UserCustomMenu } from '@models/user-custom-menu';

export class UserCustomMenuInterceptor
  implements ModelInterceptorContract<UserCustomMenu>
{
  receive(model: UserCustomMenu): UserCustomMenu {
    return model;
  }

  send(model: Partial<UserCustomMenu>): Partial<UserCustomMenu> {
    return model;
  }
}
