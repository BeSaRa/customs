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
import { StatusTypes } from '@enums/status-types';
import { map } from 'rxjs/operators';
import { AdminResult } from '@models/admin-result';
import { GetLookupServiceMixin } from '@mixins/has-lookup-service-mixin';
import { GetLookupServiceContract } from '@contracts/get-lookup-service-contract';

export abstract class BaseModel<
    M,
    S extends BaseCrudServiceContract<M, PrimaryType> | BaseCrudWithDialogServiceContract<C, M, PrimaryType>,
    C = unknown,
    PrimaryType = number
  >
  extends HasServiceMixin(ClonerMixin(GetNamesMixin(GetLookupServiceMixin(class {}))))
  implements HasServiceNameContract, ModelCrudContract<M>, BaseModelContract, CloneContract, GetNamesContract, GetLookupServiceContract
{
  abstract override $$__service_name__$$: string;
  id!: number;
  override arName!: string;
  override enName!: string;
  status!: number;
  statusInfo!: AdminResult;
  clientData!: string;
  updatedBy!: number;
  updatedOn!: string;

  private getCrudWithDialogService(): BaseCrudWithDialogServiceContract<C, M> {
    const service = this.$$getService$$<BaseCrudWithDialogServiceContract<C, M>>();
    if (!service || !service.openCreateDialog) {
      throw new Error('Please extends BaseCrudWithDialogService to use this method! in model service');
    }
    return service;
  }

  activate(): Observable<M> {
    return this.$$getService$$<S>()
      .activate(this.id as PrimaryType)
      .pipe(map(() => StatusTypes.ACTIVE))
      .pipe(
        map(status => {
          this.status = status;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.statusInfo = this.$$getLookupService$$().statusMap.get(status)!;
          return this as unknown as M;
        })
      );
  }

  create(): Observable<M> {
    return this.$$getService$$<S>().createFull(this as unknown as M);
  }

  deactivate(): Observable<M> {
    return this.$$getService$$<S>()
      .deactivate(this.id as PrimaryType)
      .pipe(map(() => StatusTypes.INACTIVE))
      .pipe(
        map(status => {
          this.status = status;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          this.statusInfo = this.$$getLookupService$$().statusMap.get(status)!;
          return this as unknown as M;
        })
      );
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
    return this.isActive() ? this.deactivate() : this.activate();
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
    return this.getCrudWithDialogService().openCreateDialog(this as unknown as M, extras, config);
  }

  openEdit(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openEditDialog(this as unknown as M, extras, config);
  }

  openEditComposite(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openEditDialogWithComposite(this as unknown as M, extras, config);
  }

  openView(extras?: object, config?: Omit<MatDialogConfig, 'data'>) {
    return this.getCrudWithDialogService().openViewDialog(this as unknown as M, extras, config);
  }
}
