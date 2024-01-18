import { Injectable } from '@angular/core';
import { MawaredDepartment } from '@models/mawared-department';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { MawaredDepartmentPopupComponent } from '@modules/administration/popups/mawared-department-popup/mawared-department-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';

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
export class MawaredDepartmentService extends BaseCrudWithDialogService<
  MawaredDepartmentPopupComponent,
  MawaredDepartment
> {
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

  @CastResponse()
  loadUserDepartments(): Observable<MawaredDepartment[]> {
    return this.http.get<MawaredDepartment[]>(
      this.getUrlSegment() + '/user-departments',
    );
  }
}
