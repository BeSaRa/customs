import { BaseModel } from '@abstracts/base-model';
import { BrokerCompanyService } from '@services/broker-company.service';
import { BrokerCompanyInterceptor } from '@model-interceptors/broker-company-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new BrokerCompanyInterceptor();
  
@InterceptModel({send,receive})
export class BrokerCompany extends BaseModel<BrokerCompany, BrokerCompanyService> {
  $$__service_name__$$ = 'BrokerCompanyService';

  buildForm(controls = false): object {
    return {}
  }
}
