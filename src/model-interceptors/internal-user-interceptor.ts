import { ModelInterceptorContract } from 'cast-response';
import { InternalUser } from '@models/internal-user';
import { UserPreferences } from '@models/user-preferences';
import { UserPreferencesInterceptor } from './user-preferences-interceptor';
import { AdminResult } from '@models/admin-result';

const userPreferencesInterceptor = new UserPreferencesInterceptor();

export class InternalUserInterceptor implements ModelInterceptorContract<InternalUser> {
  send(model: Partial<InternalUser>): Partial<InternalUser> {
    model.userPreferences && (model.userPreferences = userPreferencesInterceptor.send(model.userPreferences) as UserPreferences);
    delete model.defaultDepartmentInfo;
    delete model.jobTitleInfo;
    return model;
  }

  receive(model: InternalUser): InternalUser {
    model.defaultDepartmentInfo = AdminResult.createInstance(model.defaultDepartmentInfo);
    model.jobTitleInfo = AdminResult.createInstance(model.jobTitleInfo);
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.userPreferences && (model.userPreferences = userPreferencesInterceptor.receive(new UserPreferences().clone<UserPreferences>(model.userPreferences)));
    return model;
  }
}
