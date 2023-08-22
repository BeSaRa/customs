import { inject } from '@angular/core';
import { BaseModel } from '@abstracts/base-model';
import { InterceptModel } from 'cast-response';
import { UserInboxInterceptor } from '@model-interceptors/user-inbox-interceptor';
import { AdminResult } from './admin-result';
import { UserInboxService } from '@services/user-inbox.services';

const { send, receive } = new UserInboxInterceptor();

@InterceptModel({ send, receive })
export class UserInbox {
  $$__service_name__$$ = 'UserInboxService';
  BD_FULL_SERIAL!: string;
  BD_SUBJECT!: string;
  BD_CASE_TYPE!: string;
  PI_CREATE!: string;
  ACTIVATED!: string;
  PI_DUE!: string;
  BD_FROM_USER!: string;
  fromUserInfo!: AdminResult;
  RISK_STATUS!: number;
  riskStatusInfo!: AdminResult;
}
