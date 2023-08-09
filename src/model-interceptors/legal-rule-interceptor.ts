import { ModelInterceptorContract } from 'cast-response';
import { LegalRule } from '@models/legal-rule';

export class LegalRuleInterceptor implements ModelInterceptorContract<LegalRule> {
  send(model: Partial<LegalRule>): Partial<LegalRule> {
    return model;
  }

  receive(model: LegalRule): LegalRule {
    model.lawStartDate = new Date(model.lawStartDate).toDateString();
    return model;
  }
}
