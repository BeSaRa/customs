import { BaseModel } from '@abstracts/base-model';
import { UserPreferencesService } from '@services/user-preferences.service';

export class UserPreferences extends BaseModel<
  UserPreferences,
  UserPreferencesService
> {
  $$__service_name__$$ = 'UserPreferencesService';

  alternateEmailList!: string;
  phoneNumber!: number;
  officialPhoneNumber!: number;
  phoneExtension!: number;
  email!: string;
  isMailNotificationEnabled!: boolean;
  isSMSNotificationEnabled!: boolean;
  isPrivateUser!: boolean;
  limitedCirculation!: boolean;
  defaultLang = 1;

  // extra
  alternateEmailListParsed: string[] = [];

  buildForm(controls?: boolean): object {
    const {
      isMailNotificationEnabled,
      isSMSNotificationEnabled,
      isPrivateUser,
    } = this;

    return {
      isMailNotificationEnabled: controls
        ? [isMailNotificationEnabled]
        : isMailNotificationEnabled,
      isSMSNotificationEnabled: controls
        ? [isSMSNotificationEnabled]
        : isSMSNotificationEnabled,
      isPrivateUser: controls ? [isPrivateUser] : isPrivateUser,
    };
  }
}
