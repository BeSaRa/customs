import { StatusTypes } from '@enums/status-types';
import { Observable } from 'rxjs';

export interface ModelCrudContract<M> {
  create(model: M): Observable<M>;

  delete(): Observable<M>;

  update(model: M): Observable<M>;

  save(): Observable<M>;

  activate(status: StatusTypes): Observable<M>;

  deactivate(status: StatusTypes): Observable<M>;
}
