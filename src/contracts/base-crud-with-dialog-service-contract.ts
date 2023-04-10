import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { UserClick } from '@enums/user-click';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';

export interface BaseCrudWithDialogServiceContract<C, M, PrimaryType = number>
  extends BaseCrudServiceContract<M, PrimaryType> {
  openCreateDialog(
    model?: M,
    extras?: object,
    config?: Omit<MatDialogConfig<unknown>, 'data'>
  ): MatDialogRef<C, M | UserClick.CLOSE>;

  openEditDialog(
    model: M,
    extras?: object,
    config?: Omit<MatDialogConfig<unknown>, 'data'>
  ): MatDialogRef<C, M | UserClick.CLOSE>;

  openEditDialogWithComposite(
    model: M,
    extras?: object,
    config?: Omit<MatDialogConfig<unknown>, 'data'>
  ): MatDialogRef<C, M | UserClick.CLOSE>;

  openViewDialog(
    model: M,
    extras?: object,
    config?: Omit<MatDialogConfig<unknown>, 'data'>
  ): MatDialogRef<C, UserClick.CLOSE>;
}
