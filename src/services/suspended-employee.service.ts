import { Injectable } from '@angular/core';
import { SuspendedEmployee } from '@models/suspended-employee';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { SuspendedEmployeePopupComponent } from '@modules/administration/popups/suspended-employee-popup/suspended-employee-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => SuspendedEmployee,
    },
  },
  $default: {
    model: () => SuspendedEmployee,
  },
})
@Injectable({
  providedIn: 'root',
})
export class SuspendedEmployeeService extends BaseCrudWithDialogService<SuspendedEmployeePopupComponent, SuspendedEmployee> {
  serviceName = 'SuspendedEmployeeService';
  protected getModelClass(): Constructor<SuspendedEmployee> {
    return SuspendedEmployee;
  }

  protected getModelInstance(): SuspendedEmployee {
    return new SuspendedEmployee();
  }

  getDialogComponent(): ComponentType<SuspendedEmployeePopupComponent> {
    return SuspendedEmployeePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.SUSPENDED_EMPLOYEE;
  }
}
