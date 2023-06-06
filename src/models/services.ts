import { BaseModel } from '@abstracts/base-model';
import { ServicesService } from '@services/services.service';
import { ServicesInterceptor } from '@model-interceptors/services-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new ServicesInterceptor();
  
@InterceptModel({send,receive})
export class Services extends BaseModel<Services, ServicesService> {
  $$__service_name__$$ = 'ServicesService';

  buildForm(controls = false): object {
    return {}
  }
}
