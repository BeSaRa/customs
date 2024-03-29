import { Injectable } from '@angular/core';
import { MawaredEmployee } from '@models/mawared-employee';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { MawaredEmployeePopupComponent } from '@modules/administration/popups/mawared-employee-popup/mawared-employee-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => MawaredEmployee,
    },
  },
  $default: {
    model: () => MawaredEmployee,
  },
})
@Injectable({
  providedIn: 'root',
})
export class MawaredEmployeeService extends BaseCrudWithDialogService<
  MawaredEmployeePopupComponent,
  MawaredEmployee
> {
  serviceName = 'MawaredEmployeeService';

  protected getModelClass(): Constructor<MawaredEmployee> {
    return MawaredEmployee;
  }

  protected getModelInstance(): MawaredEmployee {
    return new MawaredEmployee();
  }

  getDialogComponent(): ComponentType<MawaredEmployeePopupComponent> {
    return MawaredEmployeePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.MAWARED_EMPLOYEE;
  }

  @CastResponse()
  syncForIntegration(options: {
    startEmployeesDate: string;
    endEmployeesDate: string;
    changeDepartmentsDate: string;
  }): Observable<MawaredEmployee[]> {
    return this.http.get<MawaredEmployee[]>(
      this.getUrlSegment() + `/admin/integration`,
      {
        params: new HttpParams({
          fromObject: { ...options },
        }),
      },
    );
  }
}
