import { Injectable } from '@angular/core';
import { BrokerCompany } from '@models/broker-company';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { BrokerCompanyPopupComponent } from '@modules/administration/popups/broker-company-popup/broker-company-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => BrokerCompany,
    },
  },
  $default: {
    model: () => BrokerCompany,
  },
})
@Injectable({
  providedIn: 'root',
})
export class BrokerCompanyService extends BaseCrudWithDialogService<BrokerCompanyPopupComponent, BrokerCompany> {
  protected override getAuditDialogComponent(): ComponentType<BrokerCompanyPopupComponent> {
    throw new Error('Method not implemented.');
  }
  serviceName = 'BrokerCompanyService';
  protected getModelClass(): Constructor<BrokerCompany> {
    return BrokerCompany;
  }

  protected getModelInstance(): BrokerCompany {
    return new BrokerCompany();
  }

  getDialogComponent(): ComponentType<BrokerCompanyPopupComponent> {
    return BrokerCompanyPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.BROKER_COMPANY;
  }
}
