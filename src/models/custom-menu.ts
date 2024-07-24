import { BaseModel } from '@abstracts/base-model';
import { CustomMenuService } from '@services/custom-menu.service';
import { CustomMenuInterceptor } from '@model-interceptors/custom-menu-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new CustomMenuInterceptor();
  
@InterceptModel({send,receive})
export class CustomMenu extends BaseModel<CustomMenu, CustomMenuService> {
  $$__service_name__$$ = 'CustomMenuService';

  buildForm(controls = false): object {
    return {}
  }
}
