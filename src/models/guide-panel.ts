import { InterceptModel } from 'cast-response';
import { GuidePanelInterceptor } from '@model-interceptors/guide-panel-interceptor';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new GuidePanelInterceptor();

@InterceptModel({ send, receive })
export class GuidePanel {
  $$__service_name__$$ = 'GuidePanelService';
  offenderType!: number;
  offenderLevel!: number;
  penaltySigner!: number;
  violationTypeId!: number;
  repeat!: number;

  buildForm(): object {
    return {
      offenderType: [null, [CustomValidators.required]],
      offenderLevel: [null],
      penaltySigner: [null, [CustomValidators.required]],
    };
  }
}
