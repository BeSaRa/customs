import { HasServiceMixin } from '@mixins/has-service-mixin';
import { HasServiceNameContract } from '@contracts/has-service-name-contract';
import { ModelCrudContract } from '@contracts/model-crud-contract';
import { BaseModelContract } from '@contracts/base-model-contract';
import { Observable } from 'rxjs';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { BaseCrudWithDialogServiceContract } from '@contracts/base-crud-with-dialog-service-contract';
import { MatDialogConfig } from '@angular/material/dialog';

export abstract class BaseModel<
    M,
    S extends
      | BaseCrudServiceContract<M, PrimaryType>
      | BaseCrudWithDialogServiceContract<C, M, PrimaryType>,
    C = unknown,
    PrimaryType = number
  >
  extends HasServiceMixin(ClonerMixin(GetNamesMixin(class {})))
  implements
    HasServiceNameContract,
    ModelCrudContract<M, PrimaryType>,
    BaseModelContract,
    CloneContract,
    GetNamesContract
{
  abstract override $$__service_name__$$: string;
  id!: number;
  override arName!: string;
  override enName!: string;
  clientData!: string;
  updatedBy!: number;
  updatedOn!: string;

  private getCrudWithDialogService(): BaseCrudWithDialogServiceContract<C, M> {
    const service =
      this.$$getService$$<BaseCrudWithDialogServiceContract<C, M>>();
    if (!service || !service.openCreateDialog) {
      throw new Error(
        'Please extends BaseCrudWithDialogService to use this method! in model service'
      );
    }
    return service;
  }

  activate(id: PrimaryType): Observable<M> {
    return this.$$getService$$<S>().activate(id);
  }

  create(model: M): Observable<M> {
    return this.$$getService$$<S>().createFull(model);
  }

  deactivate(id: PrimaryType): Observable<M> {
    return this.$$getService$$<S>().deactivate(id);
  }

  delete(): Observable<M> {
    return this.$$getService$$<S>().delete(this.id as PrimaryType);
  }

  save(): Observable<M> {
    return this.id
      ? this.update(this as unknown as M)
      : this.create(this as unknown as M);
  }

  update(model: M): Observable<M> {
    return this.$$getService$$<S>().updateFull(model);
  }

  openCreate(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openCreateDialog(
      this as unknown as M,
      extras,
      config
    );
  }

  openEdit(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openEditDialog(
      this as unknown as M,
      extras,
      config
    );
  }

  openEditComposite(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openEditDialogWithComposite(
      this as unknown as M,
      extras,
      config
    );
  }

  openView(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openViewDialog(
      this as unknown as M,
      extras,
      config
    );
  }
}
