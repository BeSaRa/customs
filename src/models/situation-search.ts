import { InterceptModel } from 'cast-response';
import { CustomValidators } from '@validators/custom-validators';
import { SituationSearchInterceptor } from '@model-interceptors/situation-search-interceptor';
import { BaseModel } from '@abstracts/base-model';
import { SituationSearchService } from '@services/situation-search.service';
import { AdminResult } from './admin-result';
import { Violation } from './violation';
import { Offender } from './offender';

const { send, receive } = new SituationSearchInterceptor();

@InterceptModel({ send, receive })
export class SituationSearch extends BaseModel<SituationSearch, SituationSearchService> {
  $$__service_name__$$ = 'SituationSearchService';
  caseId!: string;
  isProved!: boolean;
  offenderId!: number;
  violationId!: number;
  repeat!: number;

  offenderInfo!: Offender;
  violationInfo!: Violation;
  buildForm() {}
}
