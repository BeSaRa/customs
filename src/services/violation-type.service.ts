import { Injectable } from '@angular/core';
import { ViolationType } from '@models/violation-type';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => ViolationType,
    },
  },
  $default: {
    model: () => ViolationType,
  },
})
@Injectable({
  providedIn: 'root',
})
export class ViolationTypeService extends BaseCrudWithDialogService<ViolationTypePopupComponent, ViolationType> {
  serviceName = 'ViolationTypeService';
  protected getModelClass(): Constructor<ViolationType> {
    return ViolationType;
  }

  protected getModelInstance(): ViolationType {
    return new ViolationType();
  }

  getDialogComponent(): ComponentType<ViolationTypePopupComponent> {
    return ViolationTypePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.VIOLATION_TYPE;
  }
}
