import { Observable } from 'rxjs';
import { StatusTypes } from '@enums/status-types';

export interface ModelCrudContract<M> {
  create(model: M): Observable<M>;

  delete(): Observable<M>;

  update(model: M): Observable<M>;

  save(): Observable<M>;

  activate(status: StatusTypes): Observable<StatusTypes>;

  deactivate(status: StatusTypes): Observable<StatusTypes>;
}
