import { BaseCase } from '@models/base-case';
import { InvestigationService } from '@services/investigation.service';
import { CaseTypes } from '@enums/case-types';
import { InterceptModel } from 'cast-response';
import { InvestigationInterceptor } from '@model-interceptors/Investigation-interceptor';

const { send, receive } = new InvestigationInterceptor();

@InterceptModel({ send, receive })
export class Investigation extends BaseCase<InvestigationService, Investigation> {
  $$__service_name__$$ = 'InvestigationService';
  limitedAccess = false;
  investigationFullSerial!: string;
  draftFullSerial!: string;
  draftSerial!: number;
  investigationSerial!: number;
  override caseType = CaseTypes.INVESTIGATION;
  override createdOn: Date | string = new Date();

  buildForm(controls = false): object {
    const { description, createdOn, investigationFullSerial, draftFullSerial, limitedAccess } = this;
    return {
      draftFullSerial: controls ? [{ value: draftFullSerial, disabled: true }] : draftFullSerial,
      investigationFullSerial: controls ? [{ value: investigationFullSerial, disabled: true }] : investigationFullSerial,
      createdOn: controls ? [{ value: createdOn, disabled: false }] : createdOn,
      description: controls ? [description] : description,
      limitedAccess: controls ? [limitedAccess] : limitedAccess,
    };
  }
}
