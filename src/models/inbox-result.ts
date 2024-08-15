import { InterceptModel } from 'cast-response';
import { InboxInterceptor } from '@model-interceptors/inbox-interceptor';
import { AdminResult } from './admin-result';
import { OpenFrom } from '@enums/open-from';
import { INavigatedItem } from '@contracts/inavigated-item';
import { EncryptionService } from '@services/encryption.service';
import { InboxService } from '@services/inbox.services';
import { ServiceRegistry } from '@services/service-registry';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { CaseTypes } from '@enums/case-types';
import { InboxRiskStatus } from '@enums/inbox-risk-status';

const { send, receive } = new InboxInterceptor();

@InterceptModel({ send, receive })
export class InboxResult extends ClonerMixin(class {}) {
  BD_INVESTIGATION_FULL_SERIAL!: string;
  DB_GRIEVANCE_FULL_SERIAL!: string;
  BD_IS_DRAFTED!: string;
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
  TAD_DISPLAY_NAME!: keyof LangKeysContract;
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
    if (this.BD_CASE_TYPE !== CaseTypes.GRIEVANCE) {
      this.itemRoute = '/' + this.service.getServiceRoute(this.BD_CASE_TYPE);
    } else {
      this.itemRoute = '/home/electronic-services/grievance';
    }
    this.itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: !this.OWNER ? OpenFrom.TEAM_INBOX : OpenFrom.USER_INBOX,
      taskId: this.TKIID,
      caseId: this.PI_PARENT_CASE_ID,
      caseType: this.BD_CASE_TYPE,
    });
  }

  getStatusStyle() {
    let classes = 'custom-status ';
    if (this.RISK_STATUS === InboxRiskStatus.NORMAL) {
      classes += 'custom-status-normal';
    } else if (this.RISK_STATUS === InboxRiskStatus.AT_RISK) {
      classes += 'custom-status-risk';
    } else if (this.RISK_STATUS === InboxRiskStatus.OVERDUE) {
      classes += 'custom-status-overdue';
    }
    return classes;
  }
}
