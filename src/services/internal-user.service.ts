import { Injectable, inject } from '@angular/core';
import { InternalUser } from '@models/internal-user';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { HttpParams } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { BlobModel } from '@models/blob-model';
import { map } from 'rxjs';

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
export class InternalUserService extends BaseCrudWithDialogService<InternalUserPopupComponent, InternalUser> {
  protected domSanitizer = inject(DomSanitizer);
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

  downloadSignature(id: number) {
    console.log('user id: ', id);

    return this.http
      .get(this.getUrlSegment() + '/signature/content', { params: new HttpParams({ fromObject: { internalUserId: id } }), responseType: 'blob' })
      .pipe(map(blob => new BlobModel(blob, this.domSanitizer)));
  }
}
