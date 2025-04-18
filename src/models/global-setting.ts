import { BaseModel } from '@abstracts/base-model';
import { GlobalSettingService } from '@services/global-setting.service';
import { GlobalSettingInterceptor } from '@model-interceptors/global-setting-interceptor';
import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { FormBuilder, Validators } from '@angular/forms';
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
  managerMaxViolation!: number;
  maxInvestigationDelay!: number;
  customsAffairsPAOU!: number;
  customsAffairsPAOUInfo!: AdminResult;
  immunizationDuration!: number;
  // extra properties
  supportEmailListParsed: string[] = [];
  fileTypeParsed: string[] = [];

  buildForm(controls = true) {
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
      managerMaxViolation,
      maxInvestigationDelay,
      immunizationDuration,
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
        ? [
            sessionTimeout,
            [
              CustomValidators.required,
              CustomValidators.positiveNumber,
              Validators.min(1),
              Validators.max(300),
            ],
          ]
        : null,
      fileSize: controls
        ? [
            fileSize,
            [
              CustomValidators.required,
              CustomValidators.positiveNumber,
              Validators.min(5),
              Validators.max(30),
            ],
          ]
        : null,
      fileTypeParsed: controls
        ? [fileTypeParsed, CustomValidators.required]
        : '',
      inboxRefreshInterval: controls
        ? [
            inboxRefreshInterval,
            [
              CustomValidators.required,
              CustomValidators.positiveNumber,
              Validators.min(5),
              Validators.max(300),
            ],
          ]
        : null,
      immunizationDuration: controls
        ? [
            immunizationDuration,
            [CustomValidators.required, CustomValidators.positiveNumber],
          ]
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
      managerMaxViolation: controls
        ? [
            managerMaxViolation,
            [CustomValidators.required, Validators.min(2), Validators.max(50)],
          ]
        : managerMaxViolation,
      maxInvestigationDelay: controls
        ? [
            maxInvestigationDelay,
            [CustomValidators.required, Validators.min(2), Validators.max(365)],
          ]
        : maxInvestigationDelay,
    };
  }
  getApplicationName(): string {
    return this.getLangService().getCurrent().code === 'ar'
      ? this.systemArabicName
      : this.systemEnglishName;
  }
}
