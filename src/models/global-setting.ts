import { BaseModel } from '@abstracts/base-model';
import { GlobalSettingService } from '@services/global-setting.service';
import { GlobalSettingInterceptor } from '@model-interceptors/global-setting-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';

const { send, receive } = new GlobalSettingInterceptor();

@InterceptModel({ send, receive })
export class GlobalSetting extends BaseModel<GlobalSetting, GlobalSettingService> {
  $$__service_name__$$ = 'GlobalSettingService';

  systemArabicName!: string;
  systemEnglishName!: string;
  sessionTimeout!: number;
  fileSize!: number;
  fileType!: string;
  inboxRefreshInterval!: number;
  supportEmailList!: string;
  enableMailNotification!: boolean;
  enableSMSNotification!: boolean;
  maxDeductionRatio!: number;

  // extra properties
  supportEmailListParsed: string[] = [];
  fileTypeParsed: string[] = [];

  buildForm(controls = false): object {
    const {
      systemArabicName,
      systemEnglishName,
      sessionTimeout,
      fileSize,
      fileTypeParsed,
      inboxRefreshInterval,
      supportEmailListParsed,
      enableMailNotification,
      enableSMSNotification,
      maxDeductionRatio,
    } = this;
    return {
      systemArabicName: controls
        ? [systemArabicName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('AR_ONLY')]]
        : systemArabicName,
      systemEnglishName: controls
        ? [systemEnglishName, [CustomValidators.required, CustomValidators.maxLength(50), CustomValidators.pattern('ENG_ONLY')]]
        : systemEnglishName,
      sessionTimeout: controls ? [sessionTimeout, [CustomValidators.required, CustomValidators.number]] : sessionTimeout,
      fileSize: controls ? [fileSize, [CustomValidators.required, CustomValidators.number]] : fileSize,
      fileTypeParsed: controls ? [fileTypeParsed, CustomValidators.required] : fileTypeParsed,
      inboxRefreshInterval: controls ? [inboxRefreshInterval, CustomValidators.required] : inboxRefreshInterval,
      supportEmailListParsed: controls ? [supportEmailListParsed, CustomValidators.required] : supportEmailListParsed,
      enableMailNotification: controls ? [enableMailNotification, CustomValidators.required] : enableMailNotification,
      enableSMSNotification: controls ? [enableSMSNotification, CustomValidators.required] : enableSMSNotification,
      maxDeductionRatio: controls ? [maxDeductionRatio, CustomValidators.required] : maxDeductionRatio,
    };
  }
}
