import { InterceptModel } from 'cast-response';
import { InboxInterceptor } from '@model-interceptors/inbox-interceptor';
import { AdminResult } from './admin-result';
import { OpenFrom } from '@enums/open-from';
import { INavigatedItem } from '@contracts/inavigated-item';
import { EncryptionService } from '@services/encryption.service';
import { InboxService } from '@services/inbox.services';
import { ServiceRegistry } from '@services/service-registry';
import { ClonerMixin } from '@mixins/cloner-mixin';

const { send, receive } = new InboxInterceptor();

@InterceptModel({ send, receive })
export class InboxResult extends ClonerMixin(class {}) {
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

  service!: InboxService;
  encrypt!: EncryptionService;

  constructor() {
    super();
    this.service = ServiceRegistry.get('InboxService');
    this.encrypt = new EncryptionService();
  }

  setItemRoute(): void {
    this.itemRoute = '/' + this.service.getServiceRoute(this.BD_CASE_TYPE);
    this.itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: !this.OWNER ? OpenFrom.TEAM_INBOX : OpenFrom.USER_INBOX,
      taskId: this.TKIID,
      caseId: this.PI_PARENT_CASE_ID,
      caseType: this.BD_CASE_TYPE,
    });
  }
}
