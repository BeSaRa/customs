import { Constructor } from '@app-types/constructors';
import { Observable } from 'rxjs';

export interface BaseCaseServiceContract<M> {
  getUrlSegment(): string;

  getModelInstance(): M;

  getModelClass(): Constructor<M>;

  create(model: M): Observable<M>;

  update(model: M): Observable<M>;

  getActions(criteria: { caseId: string; offset: number; limit: number }): Observable<unknown>;

  exportActions(criteria: { caseId: string; offset: number; limit: number }): Observable<unknown>;

  getAssignedTo(caseId: string): Observable<unknown>;

  getDetails(caseId: string): Observable<unknown>;

  insertDocument(caseId: string, document: object): Observable<unknown>;

  insertBulkDocuments(caseId: string, documents: object[]): Observable<unknown>;

  getDocuments(caseId: string): Observable<unknown>;

  getDocumentsItems(caseId: string): Observable<unknown>;

  start(caseId: string): Observable<unknown>;

  commit(model: M): Observable<unknown>;

  deleteDocument(docId: string): Observable<unknown>;

  downloadDocumentAsPDF(docId: string): Observable<unknown>;

  deleteDocuments(docIds: string[]): Observable<unknown>;

  draft(model: M): Observable<M>;

  validateDraft(model: M): Observable<M>;

  getActiveLicense(caseId: string): Observable<M[]>;

  getHoldLicense(caseId: string): Observable<M[]>;

  exportCase(caseId: string): Observable<M[]>;

  search(caseId: string): Observable<M[]>;

  exportSearchResult(caseId: string): Observable<M[]>;

  startTask(caseId: string): Observable<M>;

  getTask(taskId: string): Observable<M>;

  claimTask(taskId: string): Observable<M>;

  completeTask(taskId: string): Observable<M>;

  terminate(taskId: string): Observable<M>;
}