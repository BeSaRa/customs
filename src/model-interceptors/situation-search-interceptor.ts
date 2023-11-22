import { ModelInterceptorContract } from 'cast-response';
import { AdminResult } from '@models/admin-result';
import { SituationSearch } from '@models/situation-search';
import { Violation } from '@models/violation';
import { ViolationInterceptor } from './violation-interceptor';
import { Offender } from '@models/offender';
import { OffenderInterceptor } from './offender-interceptor';

export class SituationSearchInterceptor implements ModelInterceptorContract<SituationSearch> {
  send(model: Partial<SituationSearch>): Partial<SituationSearch> {
    delete model.statusInfo;
    delete model.offenderInfo;
    delete model.violationInfo;
    return model;
  }

  receive(model: SituationSearch): SituationSearch {
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.offenderInfo = new Offender().clone<Offender>(new OffenderInterceptor().receive(model.offenderInfo));
    model.violationInfo = new Violation().clone<Violation>(new ViolationInterceptor().receive(model.violationInfo));

    return model;
  }
}
