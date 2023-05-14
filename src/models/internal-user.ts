import { BaseModel } from '@abstracts/base-model';
import { InternalUserService } from '@services/internal-user.service';
import { InternalUserInterceptor } from '@model-interceptors/internal-user-interceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from './admin-result';
import { CustomValidators } from '@validators/custom-validators';
import { UserPreferences } from './user-preferences';


const { send, receive } = new InternalUserInterceptor();
  
@InterceptModel({send,receive})
export class InternalUser extends BaseModel<InternalUser, InternalUserService> {
  $$__service_name__$$ = 'InternalUserService';

  customRoleId!: number;
  defaultDepartmentInfo!: AdminResult;
  defaultOUId!: number;
  departmentInfo!: AdminResult;
  domainName!: string;
  email!: string;
  empNum!: string;
  jobTitle!: number;
  jobTitleInfo!: AdminResult;
  officialPhoneNumber!: string;
  phoneExtension!: string;
  phoneNumber!: string;
  qid!: string;
  statusInfo!: AdminResult;

  userPreferences!: UserPreferences;

  buildForm(controls = false): object {
    const { 
      domainName, 
      arName, 
      enName, 
      empNum, 
      email, 
      phoneNumber, 
      status,
    } = this;

    return {
      domainName: controls ? [domainName, 
        CustomValidators.required,
        // CustomValidators.maxLength(50),
        // CustomValidators.pattern('ENG_NUM_ONLY')
      ] : domainName,
      arName: controls ? [arName, 
        CustomValidators.required,
        // CustomValidators.maxLength(50),
        // CustomValidators.pattern('AR_NUM')
      ] : arName,
      enName: controls ? [enName, 
        CustomValidators.required,
        // CustomValidators.maxLength(50),
        // CustomValidators.pattern('ENG_NUM')
      ] : enName,
      empNum: controls ? [empNum, 
        CustomValidators.required,
        // CustomValidators.number,
        // CustomValidators.maxLength(10)
      ] : empNum,
      email: controls ? [email, 
        // CustomValidators.required,
        // CustomValidators.pattern('EMAIL')
      ] : email,
      phoneNumber: controls ? [phoneNumber,
      // CustomValidators.pattern('PHONE_NUMBER')
      ] : phoneNumber,
      status: controls ? [status, CustomValidators.required] : status,
    };
  }

  buildUserPreferencesForm(controls = false): object {
    const { 
      userPreferences 
    } = this;
    return userPreferences? {
      isMailNotificationEnabled: controls ? [userPreferences.isMailNotificationEnabled, CustomValidators.required] : userPreferences.isMailNotificationEnabled,
      isSMSNotificationEnabled: controls ? [userPreferences.isSMSNotificationEnabled, CustomValidators.required] : userPreferences.isSMSNotificationEnabled,
      isPrivateUser: controls ? [userPreferences.isPrivateUser, CustomValidators.required] : userPreferences.isPrivateUser,
      limitedCirculation: controls ? [userPreferences.limitedCirculation, CustomValidators.required] : userPreferences.limitedCirculation,
      defaultLang: controls? [userPreferences.defaultLang] : userPreferences.defaultLang 
    } : {
        isMailNotificationEnabled: [false, CustomValidators.required],
        isSMSNotificationEnabled: [false, CustomValidators.required],
        isPrivateUser: [false, CustomValidators.required],
        limitedCirculation: [false, CustomValidators.required],
        defaultLang: [1, CustomValidators.required],
    }
  }
}
