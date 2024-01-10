import { Injectable } from '@angular/core';
import { SuspendedEmployee } from '@models/suspended-employee';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { SuspendedEmployeePopupComponent } from '@modules/administration/popups/suspended-employee-popup/suspended-employee-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserClick } from '@enums/user-click';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';

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

  openExtendSuspensionDialog(
    model: SuspendedEmployee,
    extras?: object | undefined,
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined
  ): MatDialogRef<SuspendedEmployeePopupComponent, SuspendedEmployee | UserClick.CLOSE> {
    return this.dialog.open<SuspendedEmployeePopupComponent, CrudDialogDataContract<SuspendedEmployee>, SuspendedEmployee | UserClick.CLOSE>(
      this.getDialogComponent(),
      {
        ...config,
        disableClose: true,
        data: {
          model,
          extras: { ...extras },
          operation: OperationType.EXTEND_SUSPENSION,
        },
      }
    );
  }
}
