import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { Constructor } from '@app-types/constructors';
import { BaseCaseServiceContract } from '@contracts/base-case-service-contract';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { UrlService } from '@services/url.service';

export abstract class BaseCaseService<M> extends RegisterServiceMixin(class {}) implements BaseCaseServiceContract<M> {
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);

  abstract getUrlSegment(): string;

  abstract getModelInstance(): M;

  abstract getModelClass(): Constructor<M>;

  create(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment(), model);
  }

  update(model: M): Observable<M> {
    return this.http.put<M>(this.getUrlSegment(), model);
  }

  getActions(criteria: { caseId: string; offset: number; limit: number }): Observable<unknown> {
    return this.http.get<unknown>(this.getUrlSegment() + '/' + criteria.caseId + '/actions', {
      params: new HttpParams({
        fromObject: { offset: criteria.offset, limit: criteria.limit },
      }),
    });
  }

  exportActions(criteria: { caseId: string; offset: number; limit: number }): Observable<unknown> {
    return this.http.get<unknown>(this.getUrlSegment() + '/' + criteria.caseId + '/actions/export', {
      params: new HttpParams({
        fromObject: { offset: criteria.offset, limit: criteria.limit },
      }),
    });
  }

  getAssignedTo(caseId: string): Observable<unknown> {
    return this.http.get<unknown>(this.getUrlSegment() + '/' + caseId + '/assigned-to');
  }

  getDetails(caseId: string): Observable<unknown> {
    return this.http.get<unknown>(this.getUrlSegment() + '/' + caseId + '/details');
  }

  insertDocument(caseId: string, document: object): Observable<unknown> {
    return this.http.post<unknown>(
      this.getUrlSegment() + '/' + caseId + '/document',
      {},
      {
        params: new HttpParams({
          fromObject: { ...document },
        }),
      }
    );
  }

  insertBulkDocuments(caseId: string, document: object[]): Observable<unknown> {
    // TODO: check with the backend team if there is case to use bulk insert document
    return this.http.post<unknown>(
      this.getUrlSegment() + '/' + caseId + '/document/bulk',
      {},
      {
        params: new HttpParams({
          fromObject: { ...document[0] },
        }),
      }
    );
  }

  getDocuments(caseId: string): Observable<unknown> {
    return this.http.get(this.getUrlSegment() + '/' + caseId + '/folder/contained-documents');
  }

  getDocumentsItems(caseId: string): Observable<unknown> {
    return this.http.get(this.getUrlSegment() + '/' + caseId + '/folder/contained-documents-item');
  }

  start(caseId: string): Observable<unknown> {
    return this.http.post(this.getUrlSegment() + '/' + caseId + '/start', {});
  }

  commit(model: M): Observable<unknown> {
    return this.http.post(this.getUrlSegment() + '/commit', model);
  }

  deleteDocument(docId: string): Observable<unknown> {
    return this.http.delete<unknown>(this.getUrlSegment() + '/document/' + docId);
  }

  downloadDocumentAsPDF(docId: string): Observable<unknown> {
    return this.http.get<unknown>(this.getUrlSegment() + '/document/' + docId + '/download');
  }

  deleteDocuments(docIds: string[]): Observable<unknown> {
    return this.http.delete<unknown>(this.getUrlSegment() + '/document/bulk', {
      params: new HttpParams({
        fromObject: { docIds: docIds },
      }),
    });
  }

  draft(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/draft', model);
  }

  validateDraft(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/draft/validate', model);
  }

  getActiveLicense(caseId: string): Observable<M[]> {
    throw new Error('Method not implemented.');
  }

  getHoldLicense(caseId: string): Observable<M[]> {
    throw new Error('Method not implemented.');
  }

  exportCase(caseId: string): Observable<M[]> {
    throw new Error('Method not implemented.');
  }

  search(caseId: string): Observable<M[]> {
    throw new Error('Method not implemented.');
  }

  exportSearchResult(caseId: string): Observable<M[]> {
    throw new Error('Method not implemented.');
  }

  startTask(caseId: string): Observable<M> {
    throw new Error('Method not implemented.');
  }

  getTask(taskId: string): Observable<M> {
    throw new Error('Method not implemented.');
  }

  claimTask(taskId: string): Observable<M> {
    throw new Error('Method not implemented.');
  }

  completeTask(taskId: string): Observable<M> {
    throw new Error('Method not implemented.');
  }

  terminate(taskId: string): Observable<M> {
    throw new Error('Method not implemented.');
  }
}
