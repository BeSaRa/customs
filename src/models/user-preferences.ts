import { BaseModel } from '@abstracts/base-model';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { EmployeeService } from '@services/employee.service';
import { UrlService } from '@services/url.service';
import { UserPreferencesService } from '@services/user-preferences.service';
import { CustomValidators } from '@validators/custom-validators';
import { Observable } from 'rxjs';

export class UserPreferences extends BaseModel<UserPreferences, UserPreferencesService> {
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

  buildForm(controls = false): object {
    const { limitedCirculation, alternateEmailList, defaultLang, isMailNotificationEnabled, isSMSNotificationEnabled, isPrivateUser } = this;

    return {
      limitedCirculation: controls ? [limitedCirculation, CustomValidators.required] : limitedCirculation,
      defaultLang: controls ? [defaultLang, CustomValidators.required] : defaultLang,
      alternateEmailList: controls ? [alternateEmailList, CustomValidators.required] : alternateEmailList,
      isMailNotificationEnabled: controls ? [isMailNotificationEnabled, CustomValidators.required] : isMailNotificationEnabled,
      isSMSNotificationEnabled: controls ? [isSMSNotificationEnabled, CustomValidators.required] : isSMSNotificationEnabled,
      isPrivateUser: controls ? [isPrivateUser, CustomValidators.required] : isPrivateUser,
    };
  }

  override save(): Observable<UserPreferences> {
    return this.$$getService$$<UserPreferencesService>().save(this);
  }
}
