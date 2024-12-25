import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Constructor } from '@app-types/constructors';
import { BlobModel } from '@models/blob-model';
import { InternalUser } from '@models/internal-user';
import { Pagination } from '@models/pagination';
import { UserSignature } from '@models/user-signature';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { map, Observable, of } from 'rxjs';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => InternalUser,
    },
  },
  $default: {
    model: () => InternalUser,
  },
})
@Injectable({
  providedIn: 'root',
})
export class InternalUserService extends BaseCrudWithDialogService<
  InternalUserPopupComponent,
  InternalUser
> {
  override serviceName = 'InternalUserService';
  protected getModelClass(): Constructor<InternalUser> {
    return InternalUser;
  }

  protected getModelInstance(): InternalUser {
    return new InternalUser();
  }

  getDialogComponent(): ComponentType<InternalUserPopupComponent> {
    return InternalUserPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.INTERNAL_USER;
  }

  downloadSignature(
    id: number,
    domSanitizer: DomSanitizer,
  ): Observable<BlobModel> {
    return this.http
      .get(this.getUrlSegment() + '/signature/content', {
        params: new HttpParams({ fromObject: { internalUserId: id } }),
        responseType: 'blob',
      })
      .pipe(map(blob => new BlobModel(blob, domSanitizer)));
  }

  uploadSignature(userSignature: UserSignature): Observable<unknown> {
    if (userSignature) {
      const formData = new FormData();
      userSignature.content
        ? formData.append('content', userSignature.content)
        : null;
      delete userSignature.content;
      return this.http.post(this.getUrlSegment() + '/signature', formData, {
        params: new HttpParams({
          fromObject: userSignature as never,
        }),
      });
    }
    return of(null);
  }

  @CastResponse()
  getInternalUsersByOuId(ouId: number): Observable<InternalUser[]> {
    return this.http.get<InternalUser[]>(
      this.getUrlSegment() + `/ouid/${ouId}`,
    );
  }

  @CastResponse()
  updateDefaultDepartment(
    id: number,
    defaultOUId: number,
  ): Observable<boolean> {
    return this.http.put<boolean>(
      this.getUrlSegment() + '/admin/default-department/update',
      { id, defaultOUId },
    );
  }

  @CastResponse()
  getManagerUsers(): Observable<InternalUser[]> {
    const url = `${this.getUrlSegment()}/manager/lookup`;
    return this.http.get<InternalUser[]>(url);
  }

  @CastResponse()
  getAdminEmployees(ouId: number): Observable<InternalUser[]> {
    const url = `${this.getUrlSegment()}/admin/delegation/users`;
    return this.http.get<InternalUser[]>(url, {
      params: new HttpParams({ fromObject: { ouId } }),
    });
  }

  @CastResponse()
  getPreferencesEmployees(): Observable<InternalUser[]> {
    const url = `${this.getUrlSegment()}/delegation/users`;
    return this.http.get<InternalUser[]>(url);
  }
}
