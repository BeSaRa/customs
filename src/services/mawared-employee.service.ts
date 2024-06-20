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
import { MawaredEmployeeIntegration } from '@models/mawared-employee-integration';

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
  syncForIntegration(
    options: MawaredEmployeeIntegration,
  ): Observable<MawaredEmployeeIntegration[]> {
    return this.http.get<MawaredEmployeeIntegration[]>(
      this.getUrlSegment() + `/admin/integration`,
      {
        params: new HttpParams({
          fromObject: { ...options },
        }),
      },
    );
  }

  @CastResponse()
  updateUserPrivacy(userId: number) {
    return this.http.put(
      this.getUrlSegment() + `/admin/${userId}/change-private-user`,
      null,
    );
  }

  @CastResponse()
  getEmployeeByNumber(employeeNumber: number) {
    return this.http.get<MawaredEmployee[]>(this.getUrlSegment() + `/emp-no`, {
      params: new HttpParams({ fromObject: { employeeNo: employeeNumber } }),
    });
  }
}
