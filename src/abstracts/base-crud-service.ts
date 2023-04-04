import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { inject } from '@angular/core';

export abstract class BaseCrudService<M>
  extends RegisterServiceMixin(class {})
  implements BaseCrudServiceContract<M>
{
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);

  abstract getUrlSegment(): string;

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
    options: FetchOptionsContract = { offset: 0, limit: 50 }
  ): Observable<M[]> {
    return this.http.get<M[]>(this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: { ...options },
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
  loadById(id: number): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + `/${id}`);
  }

  @CastResponse()
  loadByIdComposite(id: number): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + `/${id}/composite`);
  }

  @CastResponse()
  loadAsLookups(options: FetchOptionsContract): Observable<M[]> {
    return this.http.get<M[]>(this.getUrlSegment() + '/active/lookup', {
      params: new HttpParams({
        fromObject: { ...options },
      }),
    });
  }

  @CastResponse()
  activate(id: number): Observable<M> {
    return this.http.put<M>(
      this.getUrlSegment() + `'/admin/${id}/activate`,
      {}
    );
  }

  @CastResponse()
  deactivate(id: number): Observable<M> {
    return this.http.put<M>(
      this.getUrlSegment() + `'/admin/${id}/de-activate`,
      {}
    );
  }

  @CastResponse()
  delete(id: number): Observable<M> {
    return this.http.delete<M>(this.getUrlSegment() + `'/admin/${id}`);
  }

  @CastResponse()
  updateBulk(models: M[]): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + `'/admin/bulk`, models);
  }

  @CastResponse()
  deleteBulk(models: number[]): Observable<M> {
    return this.http.request<M>(
      'DELETE',
      this.getUrlSegment() + `'/admin/bulk`,
      {
        body: models,
      }
    );
  }

  @CastResponse()
  activateBulk(models: number[]): Observable<M[]> {
    return this.http.put<M[]>(
      this.getUrlSegment() + `'/admin/bulk/activate`,
      models
    );
  }

  @CastResponse()
  deactivateBulk(models: number[]): Observable<M[]> {
    return this.http.put<M[]>(
      this.getUrlSegment() + `'/admin/bulk/activate`,
      models
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
  ): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/filter', criteria, {
      params: new HttpParams({
        fromObject: { ...options },
      }),
    });
  }
}
