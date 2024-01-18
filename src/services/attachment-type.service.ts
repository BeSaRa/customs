import { Injectable } from '@angular/core';
import { AttachmentType } from '@models/attachment-type';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { AttachmentTypePopupComponent } from '@modules/administration/popups/attachment-type-popup/attachment-type-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => AttachmentType,
    },
  },
  $default: {
    model: () => AttachmentType,
  },
})
@Injectable({
  providedIn: 'root',
})
export class AttachmentTypeService extends BaseCrudWithDialogService<
  AttachmentTypePopupComponent,
  AttachmentType
> {
  serviceName = 'AttachmentTypeService';
  protected getModelClass(): Constructor<AttachmentType> {
    return AttachmentType;
  }

  protected getModelInstance(): AttachmentType {
    return new AttachmentType();
  }

  getDialogComponent(): ComponentType<AttachmentTypePopupComponent> {
    return AttachmentTypePopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.ATTACHMENT_TYPE;
  }
}
