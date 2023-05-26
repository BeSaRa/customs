import { Injectable } from '@angular/core';
import { Broker } from '@models/broker';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { BrokerPopupComponent } from '@modules/administration/popups/broker-popup/broker-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Broker,
    },
  },
  $default: {
    model: () => Broker,
  },
})
@Injectable({
  providedIn: 'root',
})
export class BrokerService extends BaseCrudWithDialogService<
  BrokerPopupComponent,
  Broker
> {
  serviceName = 'BrokerService';

  protected getModelClass(): Constructor<Broker> {
    return Broker;
  }

  protected getModelInstance(): Broker {
    return new Broker();
  }

  getDialogComponent(): ComponentType<BrokerPopupComponent> {
    return BrokerPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.BROKER;
  }
}
