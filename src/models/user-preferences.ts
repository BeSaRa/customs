import { BaseModel } from '@abstracts/base-model';
import { UserPreferencesService } from '@services/user-preferences.service';
import { CustomValidators } from '@validators/custom-validators';
import { Observable } from 'rxjs';
import { InterceptModel } from 'cast-response';
import { UserPreferencesInterceptor } from '@model-interceptors/user-preferences-interceptor';

const { send, receive } = new UserPreferencesInterceptor();

@InterceptModel({ send, receive })
export class UserPreferences extends BaseModel<
  UserPreferences,
  UserPreferencesService
> {
  $$__service_name__$$ = 'UserPreferencesService';

  //alternateEmailList!: string;
  phoneNumber!: number;
  officialPhoneNumber!: number;
  phoneExtension!: number;
  email!: string;
  isMailNotificationEnabled!: boolean;
  isSMSNotificationEnabled!: boolean;
  isPrivateUser!: boolean;
  limitedCirculation!: boolean;
  defaultLang = 1;

  private _alternateEmailList!: string;
  public get alternateEmailList(): string {
    return this._alternateEmailList;
  }

  public set alternateEmailList(v: string) {
    this.alternateEmailListParsed = JSON.parse(v);
    this._alternateEmailList = v;
  }

  // extra
  alternateEmailListParsed: string[] = [];

  buildForm(controls = false) {
    const {
      limitedCirculation,
      alternateEmailListParsed,
      defaultLang,
      isMailNotificationEnabled,
      isSMSNotificationEnabled,
      isPrivateUser,
    } = this;

    return {
      limitedCirculation: controls
        ? [limitedCirculation, CustomValidators.required]
        : limitedCirculation,
      defaultLang: controls
        ? [defaultLang, CustomValidators.required]
        : defaultLang,
      isMailNotificationEnabled: controls
        ? [isMailNotificationEnabled, CustomValidators.required]
        : isMailNotificationEnabled,
      isSMSNotificationEnabled: controls
        ? [isSMSNotificationEnabled, CustomValidators.required]
        : isSMSNotificationEnabled,
      isPrivateUser: controls
        ? [isPrivateUser, CustomValidators.required]
        : isPrivateUser,
      alternateEmailListParsed: alternateEmailListParsed,
    };
  }

  override save(): Observable<UserPreferences> {
    return this.$$getService$$<UserPreferencesService>().save(this);
  }
}
