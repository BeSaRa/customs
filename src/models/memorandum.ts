import { MemorandumCategories } from '@enums/memorandum-categories';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { MemorandumInterceptor } from '@model-interceptors/memorandum-interceptor';
import { AppDocument } from '@models/app-document';
import { InterceptModel } from 'cast-response';
import { Investigation } from './investigation';

const { send, receive } = new MemorandumInterceptor();

@InterceptModel({ send, receive })
export class Memorandum extends ClonerMixin(AppDocument) {
  declare requestCaseId: string;
  declare opinionFullSerial: string;
  declare category: number;
  declare decisionFullSerial: string | null;
  declare referralDate: string;
  declare note: string;
  declare isApproved: boolean;
  declare offenderIds: number[];
  declare offenderType: number;

  isLegalResult() {
    return this.category === MemorandumCategories.LEGAL_RESULT;
  }

  isLegalMemorandum() {
    return this.category === MemorandumCategories.LEGAL_MEMORANDUM;
  }

  isForCurrentTask(model: Investigation) {
    return (
      this.decisionFullSerial ===
      model.taskDetails.activityProperties?.DecisionFullSerial.value
    );
  }
}
