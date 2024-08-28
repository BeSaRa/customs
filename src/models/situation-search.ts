import { InterceptModel } from 'cast-response';
import { SituationSearchInterceptor } from '@model-interceptors/situation-search-interceptor';
import { BaseModel } from '@abstracts/base-model';
import { SituationSearchService } from '@services/situation-search.service';
import { Violation } from './violation';
import { Offender } from './offender';
import { AdminResult } from '@models/admin-result';

const { send, receive } = new SituationSearchInterceptor();

@InterceptModel({ send, receive })
export class SituationSearch extends BaseModel<
  SituationSearch,
  SituationSearchService
> {
  $$__service_name__$$ = 'SituationSearchService';
  caseId!: string;
  offenderId!: number;
  violationId!: number;
  violationTypeId!: number;
  proofStatus!: number;
  proofStatusInfo!: AdminResult;
  offenderInfo!: Offender;
  violationInfo!: Violation;

  buildForm() {}
}
