import { HasServiceMixin } from '@mixins/has-service-mixin';
import { HasServiceNameContract } from '@contracts/has-service-name-contract';
import { ModelCrudContract } from '@contracts/model-crud-contract';
import { BaseModelContract } from '@contracts/base-model-contract';
import { map, Observable } from 'rxjs';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';
import { ClonerMixin } from '@mixins/cloner-mixin';
import { CloneContract } from '@contracts/clone-contract';
import { GetNamesMixin } from '@mixins/get-names-mixin';
import { GetNamesContract } from '@contracts/get-names-contract';
import { BaseCrudWithDialogServiceContract } from '@contracts/base-crud-with-dialog-service-contract';
import { MatDialogConfig } from '@angular/material/dialog';
import { StatusTypes } from '@enums/status-types';

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
    ModelCrudContract<M>,
    BaseModelContract,
    CloneContract,
    GetNamesContract
{
  abstract override $$__service_name__$$: string;
  id!: number;
  override arName!: string;
  override enName!: string;
  status!: number;
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

  activate(): Observable<StatusTypes> {
    return this.$$getService$$<S>()
      .activate(this.id as PrimaryType)
      .pipe(map(() => StatusTypes.ACTIVE));
  }

  create(): Observable<M> {
    return this.$$getService$$<S>().createFull(this as unknown as M);
  }

  deactivate(): Observable<StatusTypes> {
    return this.$$getService$$<S>()
      .deactivate(this.id as PrimaryType)
      .pipe(map(() => StatusTypes.INACTIVE));
  }

  delete(): Observable<M> {
    return this.$$getService$$<S>().delete(this.id as PrimaryType);
  }

  save(): Observable<M> {
    return this.id ? this.update() : this.create();
  }

  update(): Observable<M> {
    return this.$$getService$$<S>().updateFull(this as unknown as M);
  }

  toggleStatus(): Observable<M> {
    return (this.isActive() ? this.deactivate() : this.activate()).pipe(
      map((statue) => {
        this.status = statue;
        return this as unknown as M;
      })
    );
  }

  isActive(): boolean {
    return this.status === StatusTypes.ACTIVE;
  }

  isInActive(): boolean {
    return this.status === StatusTypes.INACTIVE;
  }

  isDeleted(): boolean {
    return this.status === StatusTypes.DELETED;
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
