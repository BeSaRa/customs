import { ModelInterceptorContract } from 'cast-response';
import { InfoContract } from '@contracts/info-contract';
import { GlobalSettingInterceptor } from '@model-interceptors/global-setting-interceptor';

const globalSettingInterceptor = new GlobalSettingInterceptor();

export class InfoInterceptor implements ModelInterceptorContract<InfoContract> {
  send(model: Partial<InfoContract>): Partial<InfoContract> {
    return model;
  }

  receive(model: InfoContract): InfoContract {
    model.globalSetting = globalSettingInterceptor.receive(model.globalSetting);
    return model;
  }
}
