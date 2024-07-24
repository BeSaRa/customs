import { ModelInterceptorContract } from 'cast-response';
import { CustomMenu } from '@models/custom-menu';

export class CustomMenuInterceptor implements ModelInterceptorContract<CustomMenu> {
  send(model: Partial<CustomMenu>): Partial<CustomMenu> {
    return model;
  }

  receive(model: CustomMenu): CustomMenu {
    return model;
  }
}
