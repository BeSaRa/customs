import { InterceptModel } from 'cast-response';
import { GuidePanelInterceptor } from '@model-interceptors/guide-panel-interceptor';
import { CustomValidators } from '@validators/custom-validators';
import { Validators } from '@angular/forms';

const { send, receive } = new GuidePanelInterceptor();

@InterceptModel({ send, receive })
export class GuidePanel {
  $$__service_name__$$ = 'GuidePanelService';
  offenderType!: number;
  offenderLevel!: number;
  violationTypeIdsList!: number[];
  repeat!: number;
  penaltySigner!: number;
  buildForm(): object {
    const {
      offenderType,
      offenderLevel,
      violationTypeIdsList,
      repeat,
      penaltySigner,
    } = this;
    return {
      offenderType: [offenderType, [CustomValidators.required]],
      offenderLevel: [offenderLevel],
      violationTypeIdsList: [violationTypeIdsList, [CustomValidators.required]],
      repeat: [repeat, [Validators.min(1)]],
      penaltySigner: [penaltySigner, [CustomValidators.required]],
    };
  }
}
