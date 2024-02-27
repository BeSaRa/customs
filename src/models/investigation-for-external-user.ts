import { InvestigationForExternalUserInterceptor } from '@model-interceptors/InvestigationForExternalUserInterceptor';
import { InterceptModel } from 'cast-response';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new InvestigationForExternalUserInterceptor();

@InterceptModel({ send, receive })
export class InvestigationForExternalUser {
  caseId!: string;
  caseStatus!: number;
  caseStatusInfo!: AdminResult;
  dateCreated!: string;
  draftFullSerial!: string;
  investigationFullSerial!: string;
  updatedOn!: string;
}
