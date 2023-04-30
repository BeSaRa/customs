import { Observable } from 'rxjs';

export interface ModelCrudContract<M, PrimaryType = number> {
  create(model: M): Observable<M>;

  delete(): Observable<M>;

  update(model: M): Observable<M>;

  save(): Observable<M>;

  activate(id: PrimaryType): Observable<M>;

  deactivate(id: PrimaryType): Observable<M>;
}
