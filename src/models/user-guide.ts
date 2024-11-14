import { BaseModel } from '@abstracts/base-model';
import { UserGuideService } from '@services/user-guide.service';
import { UserGuideInterceptor } from '@model-interceptors/user-guide-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new UserGuideInterceptor();

@InterceptModel({ send, receive })
export class UserGuide extends BaseModel<UserGuide, UserGuideService> {
  $$__service_name__$$ = 'UserGuideService';
  guideURL!: string;

  buildForm(controls = false): object {
    const { guideURL, arName, enName } = this;
    return {
      guideURL: controls ? [guideURL, CustomValidators.required] : guideURL,
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
    };
  }
}
