import { Injectable } from '@angular/core';
import { MawaredDepartment } from '@models/mawared-department';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { MawaredDepartmentPopupComponent } from '@modules/administration/popups/mawared-department-popup/mawared-department-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => MawaredDepartment,
    },
  },
  $default: {
    model: () => MawaredDepartment,
  },
})
@Injectable({
  providedIn: 'root',
})
export class MawaredDepartmentService extends BaseCrudWithDialogService<MawaredDepartmentPopupComponent, MawaredDepartment> {
  protected override getAuditDialogComponent(): ComponentType<MawaredDepartmentPopupComponent> {
    throw new Error('Method not implemented.');
  }
  serviceName = 'MawaredDepartmentService';
  protected getModelClass(): Constructor<MawaredDepartment> {
    return MawaredDepartment;
  }

  protected getModelInstance(): MawaredDepartment {
    return new MawaredDepartment();
  }

  getDialogComponent(): ComponentType<MawaredDepartmentPopupComponent> {
    return MawaredDepartmentPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.MAWARED_DEPARTMENT;
  }
}
