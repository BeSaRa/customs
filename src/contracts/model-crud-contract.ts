import { StatusTypes } from '@enums/status-types';
import { Observable } from 'rxjs';

export interface ModelCrudContract<M, PrimaryType = number> {
  create(model: M): Observable<M>;

  delete(): Observable<M>;

  update(model: M): Observable<M>;

  save(): Observable<M>;

  activate(status: StatusTypes): Observable<StatusTypes>;

  deactivate(status: StatusTypes): Observable<StatusTypes>;
}
