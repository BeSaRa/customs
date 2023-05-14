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
      domainName: controls ? [domainName, CustomValidators.required] : domainName,
      arName: controls ? [arName, CustomValidators.required] : arName,
      enName: controls ? [enName, CustomValidators.required] : enName,
      empNum: controls ? [empNum, CustomValidators.required] : empNum,
      email: controls ? [email, CustomValidators.required] : email,
      phoneNumber: controls ? [phoneNumber] : phoneNumber,
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
    } : {
        isMailNotificationEnabled: [false, CustomValidators.required],
        isSMSNotificationEnabled: [false, CustomValidators.required],
        isPrivateUser: [false, CustomValidators.required],
    }
  }
}
