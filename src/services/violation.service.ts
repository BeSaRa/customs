import { LangService } from '@services/lang.service';
import { inject, Injectable } from '@angular/core';
import { Violation } from '@models/violation';
import { Constructor } from '@app-types/constructors';
import { ViolationPopupComponent } from '@standalone/popups/violation-popup/violation-popup.component';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $default: {
    model: () => Violation,
  },
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Violation,
    },
  },
})
@Injectable({
  providedIn: 'root',
})
export class ViolationService extends BaseCrudWithDialogService<
  ViolationPopupComponent,
  Violation
> {
  lang = inject(LangService);
  serviceName = 'ViolationService';

  protected getDialogComponent(): ComponentType<ViolationPopupComponent> {
    return ViolationPopupComponent;
  }

  protected getUrlSegment(): string {
    return this.urlService.URLS.VIOLATION;
  }

  protected getModelInstance(): Violation {
    return new Violation();
  }

  protected getModelClass(): Constructor<Violation> {
    return Violation;
  }

  getViolationWithDateLabel(model: Violation) {
    return (
      model.violationTypeInfo?.getNames() +
      ' - ' +
      (model.violationsDate
        ? new Date(model.violationsDate).toLocaleDateString('en-GB')
        : this.lang.map.date_from +
          ' ' +
          new Date(model.violationsDateFrom).toLocaleDateString('en-GB') +
          ' ' +
          this.lang.map.date_to +
          ' ' +
          new Date(model.violationsDateTo).toLocaleDateString('en-GB'))
    );
  }
}
