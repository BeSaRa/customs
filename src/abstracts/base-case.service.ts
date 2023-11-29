import { EmployeeService } from '@services/employee.service';
import { RegisterServiceMixin } from '@mixins/register-service-mixin';
import { Constructor } from '@app-types/constructors';
import { BaseCaseServiceContract } from '@contracts/base-case-service-contract';
import { map, Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { inject } from '@angular/core';
import { UrlService } from '@services/url.service';
import { CastResponse } from 'cast-response';
import { CaseFolder } from '@models/case-folder';
import { CaseAttachment } from '@models/case-attachment';
import { MatDialogRef } from '@angular/material/dialog';
import { CaseAttachmentPopupComponent } from '@standalone/popups/case-attachment-popup/case-attachment-popup.component';
import { DialogService } from '@services/dialog.service';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { DomSanitizer } from '@angular/platform-browser';
import { BlobModel } from '@models/blob-model';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { MenuItemService } from '@services/menu-item.service';
import { Penalty } from '@models/penalty';

export abstract class BaseCaseService<M> extends RegisterServiceMixin(class {}) implements BaseCaseServiceContract<M> {
  protected http: HttpClient = inject(HttpClient);
  protected urlService: UrlService = inject(UrlService);
  protected dialog: DialogService = inject(DialogService);
  protected domSanitizer = inject(DomSanitizer);
  protected menuItemService = inject(MenuItemService);
  employeeService = inject(EmployeeService);
  abstract serviceKey: keyof LangKeysContract;

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

  @CastResponse()
  getDetails(caseId: string): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + '/' + caseId + '/details');
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

  start(caseId: string): Observable<boolean> {
    return this.http.post<boolean>(this.getUrlSegment() + '/' + caseId + '/start', {});
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

  // search(caseId: string): Observable<M[]> {
  //   throw new Error('Method not implemented.');
  // }

  exportSearchResult(caseId: string): Observable<M[]> {
    throw new Error('Method not implemented.');
  }

  startTask(caseId: string): Observable<M> {
    throw new Error('Method not implemented.');
  }

  @CastResponse(undefined, {
    unwrap: 'rs',
    fallback: '$default',
  })
  private _getTask(taskId: string): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + '/task/' + taskId);
  }

  getTask(taskId: string): Observable<M> {
    return this._getTask(taskId);
  }

  @CastResponse(undefined, {
    unwrap: 'rs',
    fallback: '$default',
  })
  claimTask(taskId: string): Observable<M> {
    return this.http.get<M>(this.getUrlSegment() + '/task/' + taskId + '/claim');
  }

  @CastResponse(undefined, {
    unwrap: 'rs',
  })
  private _getCasePenalty(caseId: string): Observable<{ [key: string]: { first: unknown; second: Penalty[] } }> {
    return this.http.get<{ [key: string]: { first: unknown; second: Penalty[] } }>(this.getUrlSegment() + '/' + caseId + '/penalty');
  }
  getCasePenalty(caseId: string): Observable<{ [key: string]: { first: unknown; second: Penalty[] } }> {
    return this._getCasePenalty(caseId).pipe(
      map(rs => {
        const obj: { [key: string]: { first: unknown; second: Penalty[] } } = {};
        Object.keys(rs).map((key: string) => {
          obj[key] = {
            ...rs[key],
            second: rs[key].second.map(o => new Penalty().clone<Penalty>({ ...o })),
          };
        });
        return obj;
      })
    );
  }
  completeTask(
    taskId: string,
    body: {
      selectedResponse: string;
      userId?: number;
      comment: string;
    }
  ): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/task/' + taskId + '/complete', body);
  }

  terminate(taskId: string): Observable<M> {
    return this.http.post<M>(this.getUrlSegment() + '/task/' + taskId + '/terminate', {});
  }

  @CastResponse(() => CaseAttachment)
  addOffenderAttachment(offenderId: number, attachment: CaseAttachment): Observable<unknown> {
    const formData = new FormData();
    attachment.content ? formData.append('content', attachment.content) : null;
    delete attachment.content;
    return this.http.post(this.getUrlSegment() + `/offender/${offenderId}/attachment`, formData, {
      params: new HttpParams({
        fromObject: attachment as never,
      }),
    });
  }

  @CastResponse(() => CaseAttachment)
  getOffenderAttachments(offenderId: number): Observable<CaseAttachment[]> {
    return this.http.get<CaseAttachment[]>(this.getUrlSegment() + `/offender/${offenderId}/contained-attachments`);
  }

  @CastResponse(() => CaseAttachment)
  addCaseAttachment(caseId: string, attachment: CaseAttachment): Observable<unknown> {
    const formData = new FormData();
    attachment.content ? formData.append('content', attachment.content) : null;
    delete attachment.content;
    return this.http.post(this.getUrlSegment() + `/${caseId}/document`, formData, {
      params: new HttpParams({
        fromObject: attachment as never,
      }),
    });
  }

  @CastResponse(() => CaseAttachment)
  addBulkCaseAttachments(caseId: string, attachments: CaseAttachment[]): Observable<unknown> {
    const formData = new FormData();
    attachments.forEach(attachment => {
      attachment.content ? formData.append('content', attachment.content) : null;
      delete attachment.content;
    });
    formData.append('attachments', new Blob([JSON.stringify(attachments)], { type: 'application/json' }));
    return this.http.post(this.getUrlSegment() + `/${caseId}/document/bulk`, formData);
  }

  @CastResponse(() => CaseFolder)
  loadCaseFolders(caseId: string): Observable<CaseFolder[]> {
    return this.http.get<CaseFolder[]>(this.getUrlSegment() + '/folder/custom/' + caseId);
  }

  @CastResponse(() => CaseAttachment)
  loadFolderAttachments(caseId: string): Observable<CaseAttachment[]> {
    return this.http.get<CaseAttachment[]>(this.getUrlSegment() + `/${caseId}/folder/contained-documents`);
  }

  openAddAttachmentDialog(
    caseId: string,
    service: BaseCaseService<unknown>,
    type: 'folder' | 'offender',
    entityId: number
  ): MatDialogRef<CaseAttachmentPopupComponent> {
    return this.dialog.open(CaseAttachmentPopupComponent, {
      data: {
        caseId,
        service,
        type,
        entityId,
      },
    });
  }

  downloadAttachment(attachmentId: string): Observable<BlobModel> {
    return this.http
      .get(this.getUrlSegment() + '/document/' + attachmentId + '/download', { responseType: 'blob' })
      .pipe(map(blob => new BlobModel(blob, this.domSanitizer)));
  }

  viewAttachment(attachmentId: string, title = 'Document'): Observable<MatDialogRef<ViewAttachmentPopupComponent>> {
    return this.downloadAttachment(attachmentId).pipe(
      map(blob => {
        return this.dialog.open(ViewAttachmentPopupComponent, {
          data: {
            model: blob,
            title: title,
          },
        });
      })
    );
  }

  deleteAttachment(attachmentId: string): Observable<unknown> {
    return this.http.delete(this.getUrlSegment() + `/document/${attachmentId}`);
  }
  getMenuItem(): MenuItemContract {
    return this.menuItemService.getMenuItemByLangKey(this.serviceKey)!;
  }
}
