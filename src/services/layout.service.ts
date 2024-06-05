import { BaseCrudService } from '@abstracts/base-crud-service';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { LayoutModel } from '@models/layout-model';
import { Pagination } from '@models/pagination';
import { CastResponseContainer } from 'cast-response';

CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => LayoutModel,
    },
  },
  $default: {
    model: () => LayoutModel,
  },
});
@Injectable({
  providedIn: 'root',
})
export class LayoutService extends BaseCrudService<LayoutModel> {
  serviceName = 'LayoutService';

  protected getModelClass(): Constructor<LayoutModel> {
    return LayoutModel;
  }

  protected getModelInstance(): LayoutModel {
    return new LayoutModel();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LAYOUT;
  }
}
