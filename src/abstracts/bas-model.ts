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

export abstract class BasModel<
    M,
    S extends BaseCrudServiceContract<M, PrimaryType>,
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

  activate(id: PrimaryType): Observable<M> {
    return this.$$getService$$<S>().activate(id);
  }

  create(model: M): Observable<M> {
    return this.$$getService$$<S>().createFull(model);
  }

  deactivate(id: PrimaryType): Observable<M> {
    return this.$$getService$$<S>().deactivate(id);
  }

  delete(id: PrimaryType): Observable<M> {
    return this.$$getService$$<S>().delete(id);
  }

  save(): Observable<M> {
    return this.id
      ? this.update(this as unknown as M)
      : this.create(this as unknown as M);
  }

  update(model: M): Observable<M> {
    return this.$$getService$$<S>().updateFull(model);
  }
}
