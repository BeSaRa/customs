import { BaseCrudService } from '@abstracts/base-crud-service';
import { inject } from '@angular/core';
import { DialogService } from '@services/dialog.service';
import { BaseCrudWithDialogServiceContract } from '@contracts/base-crud-with-dialog-service-contract';
import { ComponentType } from '@angular/cdk/portal';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserClick } from '@enums/user-click';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { OperationType } from '@enums/operation-type';
import { BaseModel } from '@abstracts/base-model';

export abstract class BaseCrudWithDialogService<
    C,
    M extends BaseModel<M, BaseCrudWithDialogServiceContract<C, M>>,
    PrimaryType = number
  >
  extends BaseCrudService<M, PrimaryType>
  implements BaseCrudWithDialogServiceContract<C, M, PrimaryType>
{
  protected dialog = inject(DialogService);

  protected abstract getDialogComponent(): ComponentType<C>;

  openCreateDialog(
    model?: M | undefined,
    extras?: object | undefined,
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined
  ): MatDialogRef<C, M | UserClick.CLOSE> {
    return this.dialog.open<C, CrudDialogDataContract<M>, M | UserClick.CLOSE>(
      this.getDialogComponent(),
      {
        ...config,
        data: {
          model: model || this.getModelInstance(),
          extras: { ...extras },
          operation: OperationType.CREATE,
        },
      }
    );
  }

  openEditDialog(
    model: M,
    extras?: object | undefined,
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined
  ): MatDialogRef<C, M | UserClick.CLOSE> {
    return this.dialog.open<C, CrudDialogDataContract<M>, M | UserClick.CLOSE>(
      this.getDialogComponent(),
      {
        ...config,
        data: {
          model,
          extras: { ...extras },
          operation: OperationType.UPDATE,
        },
      }
    );
  }

  openEditDialogWithComposite(
    model: M,
    extras?: object | undefined,
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined
  ): MatDialogRef<C, M | UserClick.CLOSE> {
    return this.dialog.open<C, CrudDialogDataContract<M>, M | UserClick.CLOSE>(
      this.getDialogComponent(),
      {
        ...config,
        data: {
          model,
          extras: { ...extras },
          operation: OperationType.UPDATE,
        },
      }
    );
  }

  openViewDialog(
    model: M,
    extras?: object | undefined,
    config?: Omit<MatDialogConfig<unknown>, 'data'> | undefined
  ): MatDialogRef<C, UserClick.CLOSE> {
    return this.dialog.open<C, CrudDialogDataContract<M>, UserClick.CLOSE>(
      this.getDialogComponent(),
      {
        ...config,
        data: {
          model,
          extras: { ...extras },
          operation: OperationType.VIEW,
        },
      }
    );
  }
}
