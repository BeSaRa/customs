import { BaseModel } from '@abstracts/base-model';
import { LayoutService } from '@services/layout.service';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { LayoutInterceptor } from '@model-interceptors/layout-interceptor';
import { InterceptModel } from 'cast-response';

const { send, receive } = new LayoutInterceptor();

@InterceptModel({ send, receive })
export class LayoutModel extends BaseModel<LayoutModel, LayoutService> {
  $$__service_name__$$ = 'LayoutService';

  userId!: number;

  internalUserInfo!: AdminResult;
  statusDateModified!: string;

  buildForm(controls = false): object {
    const { arName, enName } = this;
    return {
      arName: controls
        ? [
            arName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('AR_NUM'),
            ],
          ]
        : arName,
      enName: controls
        ? [
            enName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('ENG_NUM'),
            ],
          ]
        : enName,
    };
  }
}
