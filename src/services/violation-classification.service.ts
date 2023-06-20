import { Injectable } from '@angular/core';
import { ViolationClassification } from '@models/violation-classification';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ViolationClassification,
    },
  },
  $default: {
    model: () => ViolationClassification,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ViolationClassificationService extends BaseCrudWithDialogService<ViolationClassificationPopupComponent, ViolationClassification> {
  protected override getAuditDialogComponent(): ComponentType<ViolationClassificationPopupComponent> {
    throw new Error('Method not implemented.');
  }
  serviceName = 'ViolationClassificationService';
  protected getModelClass(): Constructor<ViolationClassification> {
    return ViolationClassification;
  }

  protected getModelInstance(): ViolationClassification {
    return new ViolationClassification();
  }

  getDialogComponent(): ComponentType<ViolationClassificationPopupComponent> {
    return ViolationClassificationPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.VIOLATION_CLASSIFICATION;
  }
}
