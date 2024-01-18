import { Injectable } from '@angular/core';
import { EmailTemplate } from '@models/email-template';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { EmailTemplatePopupComponent } from '@modules/administration/popups/email-template-popup/email-template-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => EmailTemplate,
    },
  },
  $default: {
    model: () => EmailTemplate,
  },
})
@Injectable({
  providedIn: 'root',
})
export class EmailTemplateService extends BaseCrudWithDialogService<
  EmailTemplatePopupComponent,
  EmailTemplate
> {
  serviceName = 'EmailTemplateService';
  protected getModelClass(): Constructor<EmailTemplate> {
    return EmailTemplate;
  }

  protected getModelInstance(): EmailTemplate {
    return new EmailTemplate();
  }

  getDialogComponent(): ComponentType<EmailTemplatePopupComponent> {
    return EmailTemplatePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.EMAIL_TEMPLATE;
  }
}
