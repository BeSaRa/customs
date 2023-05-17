import { UserPreferences } from '@models/user-preferences';

import { ModelInterceptorContract } from 'cast-response';

export class UserPreferencesInterceptor
  implements ModelInterceptorContract<UserPreferences>
{
  send(model: Partial<UserPreferences>): Partial<UserPreferences> {
    model.alternateEmailList = JSON.stringify(
      (model.alternateEmailListParsed ?? []).filter((email) => {
        return email.trim() !== '';
      })
    );
    delete model.alternateEmailListParsed;
    return model;
  }

  receive(model: UserPreferences): UserPreferences {
    try {
      model.alternateEmailListParsed = JSON.parse(model.alternateEmailList);
    } catch (e) {
      model.alternateEmailListParsed = [];
    }
    return model;
  }
}
