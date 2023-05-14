import { Injectable } from '@angular/core';
import { InternalUser } from '@models/internal-user';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { DomSanitizer } from '@angular/platform-browser';
    
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
InternalUser> {
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

  constructor(private domSanitizer: DomSanitizer){
    super();
  }

  // loadSignatureByGeneralUserId(generalUserId: number) {
  //   return this.http.get(this.getUrlSegment() + '/signature/content?generalUserId=' + generalUserId, {
  //     responseType: 'blob',
  //     observe: 'body'
  //   }).pipe(
  //     map(blob => new BlobModel(blob, this.domSanitizer),
  //       catchError(_ => {
  //         return of(new BlobModel(new Blob([], { type: 'error' }), this.domSanitizer));
  //       })));
  // }

  // saveSignature(generalUserId: number, file: File): Observable<boolean> {
  //   let form = new FormData();
  //   form.append('content', file);
  //   return this.http.post<boolean>(this.getUrlSegment() + '/signature?generalUserId=' + generalUserId, form);
  // }
}
