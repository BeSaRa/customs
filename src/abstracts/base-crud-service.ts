import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { BaseCrudServiceContract } from '@contracts/base-crud-service-contract';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { UrlService } from '@services/url.service';
import { CastResponse, HasInterception, InterceptParam } from 'cast-response';
import { inject } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { SortOptionsContract } from '@contracts/sort-options-contract';
import { Pagination } from '@models/pagination';

export abstract class BaseCrudService<M, PrimaryType = number>
  extends RegisterServiceMixin(class {})
  implements BaseCrudServiceContract<M, PrimaryType>
{
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);

  protected abstract getUrlSegment(): string;

  protected abstract getModelInstance(): M;

  protected abstract getModelClass(): Constructor<M>;
  @HasInterception
  @CastResponse()
  create(@InterceptParam() model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/admin', model);
  }
  @HasInterception
  @CastResponse()
  update(@InterceptParam() model: M): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + '/admin', model);
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '$pagination',
  })
  load(
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
    criteria?: Partial<M>,
    sortOptions?: SortOptionsContract
  ): Observable<Pagination<M[]>> {
    return this.http.get<Pagination<M[]>>(this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: { ...options, ...criteria, ...sortOptions },
      }),
    });
  }

  @CastResponse(undefined, {
    unwrap: '',
    fallback: '$pagination',
  })
  loadComposite(
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    },
    criteria?: Partial<M>,
    sortOptions?: SortOptionsContract
  ): Observable<Pagination<M[]>> {
    return this.http.get<Pagination<M[]>>(this.getUrlSegment() + '/composite', {
      params: new HttpParams({
        fromObject: { ...options, ...criteria, ...sortOptions },
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
    return this.http.put<M>(this.getUrlSegment() + `/admin/${id}/activate`, {});
  }

  @CastResponse()
  deactivate(id: PrimaryType): Observable<M> {
    return this.http.put<M>(
      this.getUrlSegment() + `/admin/${id}/de-activate`,
      {}
    );
  }

  @CastResponse()
  delete(id: PrimaryType): Observable<M> {
    return this.http.delete<M>(this.getUrlSegment() + `/admin/${id}`);
  }
  @HasInterception
  @CastResponse()
  updateBulk(@InterceptParam() models: M[]): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + `/admin/bulk`, models);
  }

  @CastResponse()
  deleteBulk(modelsIds: PrimaryType[]): Observable<M> {
    return this.http.request<M>(
      'DELETE',
      this.getUrlSegment() + `/admin/bulk`,
      {
        body: modelsIds,
      }
    );
  }

  @CastResponse()
  activateBulk(modelsIds: PrimaryType[]): Observable<M[]> {
    return this.http.put<M[]>(
      this.getUrlSegment() + `/admin/bulk/activate`,
      modelsIds
    );
  }

  @CastResponse()
  deactivateBulk(modelsIds: PrimaryType[]): Observable<M[]> {
    return this.http.put<M[]>(
      this.getUrlSegment() + `/admin/bulk/activate`,
      modelsIds
    );
  }
  @HasInterception
  @CastResponse()
  createBulk(@InterceptParam() models: M[]): Observable<M[]> {
    return this.http.post<M[]>(this.getUrlSegment() + '/admin/bulk', models);
  }
  @HasInterception
  @CastResponse()
  createBulkFull(@InterceptParam() models: M[]): Observable<M[]> {
    return this.http.post<M[]>(
      this.getUrlSegment() + '/admin/bulk/full',
      models
    );
  }
  @HasInterception
  @CastResponse()
  updateFull(@InterceptParam() model: M): Observable<M> {
    return this.http.put<M>(this.getUrlSegment() + '/admin/full', model);
  }
  @HasInterception
  @CastResponse()
  createFull(@InterceptParam() model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/admin/full', model);
  }

  isInstanceOf(model: unknown): model is M {
    return model instanceof this.getModelClass();
  }
}
