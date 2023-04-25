import { Observable } from 'rxjs';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { Pagination } from '@models/pagination';

export interface BaseCrudServiceContract<M, PrimaryType = number> {
  create(model: M): Observable<M>;

  update(model: M): Observable<M>;

  load(
    options: FetchOptionsContract,
    criteria?: Partial<M>
  ): Observable<Pagination<M[]>>;

  loadComposite(options: FetchOptionsContract): Observable<Pagination<M[]>>;

  loadById(id: PrimaryType): Observable<M>;

  loadByIdComposite(id: PrimaryType): Observable<M>;

  loadAsLookups(options: FetchOptionsContract): Observable<M[]>;

  activate(id: PrimaryType): Observable<M>;

  deactivate(id: PrimaryType): Observable<M>;

  delete(id: PrimaryType): Observable<M>;

  updateBulk(models: M[]): Observable<M>;

  deleteBulk(models: PrimaryType[]): Observable<M>;

  activateBulk(models: PrimaryType[]): Observable<M[]>;

  deactivateBulk(models: PrimaryType[]): Observable<M[]>;

  createBulk(models: M[]): Observable<M[]>;

  updateFull(model: M): Observable<M>;

  createFull(model: M): Observable<M>;
}
