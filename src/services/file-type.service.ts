import { Injectable } from '@angular/core';
import { FileType } from '@models/file-type';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { BaseCrudService } from '@abstracts/base-crud-service';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => FileType,
    },
  },
  $default: {
    model: () => FileType,
  },
})
@Injectable({
  providedIn: 'root',
})
export class FileTypeService extends BaseCrudService<FileType> {
  serviceName = 'FileTypeService';
  protected getModelClass(): Constructor<FileType> {
    return FileType;
  }

  protected getModelInstance(): FileType {
    return new FileType();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.FILE_TYPE;
  }
}
