import { ModelInterceptorContract } from 'cast-response';
import { InternalUser } from '@models/internal-user';
import { UserPreferences } from '@models/user-preferences';
import { UserPreferencesInterceptor } from './user-preferences-interceptor';

const userPreferencesInterceptor = new UserPreferencesInterceptor();

export class InternalUserInterceptor implements ModelInterceptorContract<InternalUser> {
  send(model: Partial<InternalUser>): Partial<InternalUser> {
    model.userPreferences && (model.userPreferences = userPreferencesInterceptor.send(model.userPreferences) as UserPreferences);
    return model;
  }

  receive(model: InternalUser): InternalUser {
    model.userPreferences && (model.userPreferences = userPreferencesInterceptor.receive(new UserPreferences().clone<UserPreferences>(model.userPreferences)));
    return model;
  }
}
