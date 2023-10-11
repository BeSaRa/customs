import { ModelInterceptorContract } from 'cast-response';
import { InternalUserOU } from '@models/internal-user-ou';
import { AdminResult } from '@models/admin-result';

export class InternalUserOUInterceptor implements ModelInterceptorContract<InternalUserOU> {
  send(model: Partial<InternalUserOU>): Partial<InternalUserOU> {
    delete model.statusInfo;
    delete model.internalUserInfo;
    delete model.organizationUnitInfo;
    return model;
  }

  receive(model: InternalUserOU): InternalUserOU {
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.internalUserInfo && (model.internalUserInfo = AdminResult.createInstance(model.internalUserInfo));
    model.organizationUnitInfo && (model.organizationUnitInfo = AdminResult.createInstance(model.organizationUnitInfo));
    return model;
  }
}
