import { BaseModel } from '@abstracts/base-model';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { InternalUserOUInterceptor } from '@model-interceptors/internal-user-ou-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new InternalUserOUInterceptor();

@InterceptModel({ send, receive })
export class InternalUserOU extends BaseModel<InternalUserOU, InternalUserOUService> {
  $$__service_name__$$ = 'InternalUserOUService';
  internalUserId!: number;
  internalUserInfo!: AdminResult;
  organizationUnitId!: number;
  organizationUnitInfo!: AdminResult;

  buildForm(controls = false): object {
    const { internalUserId, organizationUnitId } = this;
    return {
      internalUserId: controls ? [internalUserId, [CustomValidators.required]] : internalUserId,
      organizationUnitId: controls ? [organizationUnitId, [CustomValidators.required]] : organizationUnitId,
    };
  }
}
