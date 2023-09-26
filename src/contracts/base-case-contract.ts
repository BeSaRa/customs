import { Observable } from 'rxjs';

export interface BaseCaseContract<Model> {
  save(): Observable<Model>;

  commit(): Observable<Model>;

  draft(): Observable<Model>;
}
