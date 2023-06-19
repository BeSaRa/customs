import { Injectable } from '@angular/core';
import { ServiceSteps } from '@models/service-steps';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ServiceStepsPopupComponent } from '@modules/administration/popups/service-steps-popup/service-steps-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ServiceSteps,
    },
  },
  $default: {
    model: () => ServiceSteps,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ServiceStepsService extends BaseCrudWithDialogService<ServiceStepsPopupComponent, ServiceSteps> {
  protected override getAuditDialogComponent(): ComponentType<ServiceStepsPopupComponent> {
    throw new Error('Method not implemented.');
  }
  serviceName = 'ServiceStepsService';
  protected getModelClass(): Constructor<ServiceSteps> {
    return ServiceSteps;
  }

  protected getModelInstance(): ServiceSteps {
    return new ServiceSteps();
  }

  getDialogComponent(): ComponentType<ServiceStepsPopupComponent> {
    return ServiceStepsPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.SERVICE_STEPS;
  }
  stepsByServiceId(id: number) {}
}
