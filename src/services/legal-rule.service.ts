import { Injectable } from '@angular/core';
import { LegalRule } from '@models/legal-rule';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { LegalRulePopupComponent } from '@modules/administration/popups/legal-rule-popup/legal-rule-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
    
@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => LegalRule,
    },
  },
  $default: {
    model: () => LegalRule,
  },
})
@Injectable({
  providedIn: 'root',
})
export class LegalRuleService extends BaseCrudWithDialogService<
LegalRulePopupComponent,
LegalRule> {
  serviceName = 'LegalRuleService';
  protected getModelClass(): Constructor<LegalRule> {
    return LegalRule;
  }

  protected getModelInstance(): LegalRule {
    return new LegalRule();
  }

  getDialogComponent(): ComponentType<LegalRulePopupComponent> {
    return LegalRulePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LEGAL_RULE;
  }
}
