import { InterceptModel } from 'cast-response';
import { UserInboxInterceptor } from '@model-interceptors/user-inbox-interceptor';
import { AdminResult } from './admin-result';
import { OpenFrom } from '@enums/open-from';
import { INavigatedItem } from '@contracts/inavigated-item';
import { EncryptionService } from '@services/encryption.service';
import { UserInboxService } from '@services/user-inbox.services';
import { ServiceRegistry } from '@services/service-registry';

const { send, receive } = new UserInboxInterceptor();

@InterceptModel({ send, receive })
export class UserInbox {
  BD_FULL_SERIAL!: string;
  BD_SUBJECT!: string;
  BD_CASE_TYPE!: number;
  PI_CREATE!: string;
  ACTIVATED!: string;
  PI_DUE!: string;
  BD_FROM_USER!: string;
  RISK_STATUS!: number;
  OWNER!: string;
  TKIID!: string;
  PI_PARENT_CASE_ID!: string;

  fromUserInfo!: AdminResult;
  riskStatusInfo!: AdminResult;

  itemRoute!: string;
  itemDetails!: string;

  service!: UserInboxService;
  encrypt!: EncryptionService;

  constructor() {
    this.service = ServiceRegistry.get('UserInboxService');
    this.encrypt = new EncryptionService();
  }

  setItemRoute(): void {
    this.itemRoute = '/' + this.service.getServiceRoute(this.BD_CASE_TYPE) + '/service';
    this.itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: !this.OWNER ? OpenFrom.TEAM_INBOX : OpenFrom.USER_INBOX,
      taskId: this.TKIID,
      caseId: this.PI_PARENT_CASE_ID,
      caseType: this.BD_CASE_TYPE,
    });
  }
}
