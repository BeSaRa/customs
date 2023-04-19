import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { inject } from '@angular/core';
import { Constructor } from '@app-types/constructors';

export abstract class BaseCrudService<M, PrimaryType = number>
  extends RegisterServiceMixin(class {})
  implements BaseCrudServiceContract<M, PrimaryType>
{
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);

  protected abstract getUrlSegment(): string;

  protected abstract getModelInstance(): M;

  protected abstract getModelClass(): Constructor<M>;

  @CastResponse()
  create(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/admin', model);
  }

  @CastResponse()
  update(model: M): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + '/admin', model);
  }

  @CastResponse()
  load(
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
    criteria?: Partial<M>
  ): Observable<M[]> {
    return this.http.get<M[]>(this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: { ...options, ...criteria },
      }),
    });
  }

  @CastResponse()
  loadComposite(
    options: FetchOptionsContract = { offset: 0, limit: 50 }
  ): Observable<M[]> {
    return this.http.get<M[]>(this.getUrlSegment() + '/composite', {
      params: new HttpParams({
        fromObject: { ...options },
      }),
    });
  }

  @CastResponse()
  loadById(id: PrimaryType): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + `/${id}`);
  }

  @CastResponse()
  loadByIdComposite(id: PrimaryType): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + `/${id}/composite`);
  }

  @CastResponse()
  loadAsLookups(options?: FetchOptionsContract): Observable<M[]> {
    return this.http.get<M[]>(this.getUrlSegment() + '/active/lookup', {
      params: new HttpParams({
        fromObject: { ...options },
      }),
    });
  }

  @CastResponse()
  activate(id: PrimaryType): Observable<M> {
    return this.http.put<M>(
      this.getUrlSegment() + `'/admin/${id}/activate`,
      {}
    );
  }

  @CastResponse()
  deactivate(id: PrimaryType): Observable<M> {
    return this.http.put<M>(
      this.getUrlSegment() + `'/admin/${id}/de-activate`,
      {}
    );
  }

  @CastResponse()
  delete(id: PrimaryType): Observable<M> {
    return this.http.delete<M>(this.getUrlSegment() + `'/admin/${id}`);
  }

  @CastResponse()
  updateBulk(models: M[]): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + `'/admin/bulk`, models);
  }

  @CastResponse()
  deleteBulk(modelsIds: PrimaryType[]): Observable<M> {
    return this.http.request<M>(
      'DELETE',
      this.getUrlSegment() + `'/admin/bulk`,
      {
        body: modelsIds,
      }
    );
  }

  @CastResponse()
  activateBulk(modelsIds: PrimaryType[]): Observable<M[]> {
    return this.http.put<M[]>(
      this.getUrlSegment() + `'/admin/bulk/activate`,
      modelsIds
    );
  }

  @CastResponse()
  deactivateBulk(modelsIds: PrimaryType[]): Observable<M[]> {
    return this.http.put<M[]>(
      this.getUrlSegment() + `'/admin/bulk/activate`,
      modelsIds
    );
  }

  @CastResponse()
  createBulk(models: M[]): Observable<M[]> {
    return this.http.post<M[]>(this.getUrlSegment() + '/admin/bulk', models);
  }

  @CastResponse()
  updateFull(model: M): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + '/admin/full', model);
  }

  @CastResponse()
  createFull(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/admin/full', model);
  }

  @CastResponse()
  filter(
    criteria: Partial<M>,
    options: FetchOptionsContract = { offset: 0, limit: 50 }
  ): Observable<M[]> {
    return this.http.get<M[]>(this.getUrlSegment() + '/filter', {
      params: new HttpParams({
        fromObject: {
          ...options,
          ...criteria,
        },
      }),
    });
  }

  isInstanceOf(model: unknown): model is M {
    return model instanceof this.getModelClass();
  }
}
