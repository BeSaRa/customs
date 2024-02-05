import { BaseModel } from '@abstracts/base-model';
import { GlobalSettingService } from '@services/global-setting.service';
import { GlobalSettingInterceptor } from '@model-interceptors/global-setting-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { FormBuilder } from '@angular/forms';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new GlobalSettingInterceptor();

@InterceptModel({ send, receive })
export class GlobalSetting extends BaseModel<
  GlobalSetting,
  GlobalSettingService
> {
  $$__service_name__$$ = 'GlobalSettingService';
  systemArabicName!: string;
  systemEnglishName!: string;
  sessionTimeout!: number;
  fileSize!: number;
  fileType!: string;
  inboxRefreshInterval!: number;
  supportEmailList!: string;
  enableMailNotification!: number;
  enableSMSNotification!: number;
  maxDeductionRatio!: number;
  customsAffairsPAOU!: number;
  customsAffairsPAOUInfo!: AdminResult;
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
        ? [
            systemArabicName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('AR_ONLY'),
            ],
          ]
        : '',
      systemEnglishName: controls
        ? [
            systemEnglishName,
            [
              CustomValidators.required,
              CustomValidators.maxLength(50),
              CustomValidators.pattern('ENG_ONLY'),
            ],
          ]
        : '',
      sessionTimeout: controls
        ? [sessionTimeout, [CustomValidators.required, CustomValidators.number]]
        : null,
      fileSize: controls
        ? [fileSize, [CustomValidators.required, CustomValidators.number]]
        : null,
      fileTypeParsed: controls
        ? [fileTypeParsed, CustomValidators.required]
        : '',
      inboxRefreshInterval: controls
        ? [inboxRefreshInterval, CustomValidators.required]
        : null,
      supportEmailListParsed: new FormBuilder().array([
        [
          controls ? supportEmailListParsed : '',
          [CustomValidators.required, CustomValidators.pattern('EMAIL')],
        ],
      ]),
      enableMailNotification: controls
        ? [enableMailNotification, CustomValidators.required]
        : null,
      enableSMSNotification: controls
        ? [enableSMSNotification, CustomValidators.required]
        : null,
      maxDeductionRatio: controls
        ? [maxDeductionRatio, CustomValidators.required]
        : null,
    };
  }
  getApplicationName(): string {
    return this.getLangService().getCurrent().code === 'ar'
      ? this.systemArabicName
      : this.systemEnglishName;
  }
}
