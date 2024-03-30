import { AppDocument } from '@models/app-document';
import { MemorandumInterceptor } from '@model-interceptors/memorandum-interceptor';
import { InterceptModel } from 'cast-response';
import { ClonerMixin } from '@mixins/cloner-mixin';

const { send, receive } = new MemorandumInterceptor();

@InterceptModel({ send, receive })
export class Memorandum extends ClonerMixin(AppDocument) {
  declare requestCaseId: string;
  declare category: number;
  declare decisionFullSerial: string | null;
  declare referralDate: string;
  declare note: string;
  declare isApproved: boolean;
  declare offenderIds: number[];
}
