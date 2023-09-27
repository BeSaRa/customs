import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { Constructor } from '@app-types/constructors';
import { BaseCaseServiceContract } from '@contracts/base-case-service-contract';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { CaseFolder } from '@models/case-folder';
import { CaseAttachment } from '@models/case-attachment';
import { MatDialogRef } from '@angular/material/dialog';
import { CaseAttachmentPopupComponent } from '@standalone/popups/case-attachment-popup/case-attachment-popup.component';
import { DialogService } from '@services/dialog.service';

export abstract class BaseCaseService<M> extends RegisterServiceMixin(class {}) implements BaseCaseServiceContract<M> {
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);
  protected dialog: DialogService = inject(DialogService);

  abstract getUrlSegment(): string;

  abstract getModelInstance(): M;

  abstract getModelClass(): Constructor<M>;

  @CastResponse()
  create(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment(), model);
  }

  @CastResponse()
  update(model: M): Observable<M> {
    return this.http.put<M>(this.getUrlSegment(), model);
  }

  @CastResponse()
  commit(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/commit', model);
  }

  @CastResponse()
  draft(model: M): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/draft', model);
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

  addOffenderAttachment(): void {
    throw new Error('Method not implemented.');
  }

  getOffenderAttachments(): void {
    throw new Error('Method not implemented.');
  }

  addCaseAttachment(caseId: string): Observable<unknown> {
    return this.http.post(this.getUrlSegment() + `/${caseId}/attachment`, {});
  }

  addBulkCaseAttachments(): void {
    throw new Error('Method not implemented.');
  }

  @CastResponse(() => CaseFolder)
  loadCaseFolders(caseId: string): Observable<CaseFolder[]> {
    return this.http.get<CaseFolder[]>(this.getUrlSegment() + '/folder/custom/' + caseId);
  }

  @CastResponse(() => CaseAttachment)
  loadFolderAttachments(caseId: string): Observable<CaseAttachment[]> {
    return this.http.get<CaseAttachment[]>(this.getUrlSegment() + `/${caseId}/folder/contained-documents`);
  }

  openAddAttachmentDialog(caseId: string): MatDialogRef<CaseAttachmentPopupComponent> {
    return this.dialog.open(CaseAttachmentPopupComponent, {
      data: {
        caseId,
      },
    });
  }
}
