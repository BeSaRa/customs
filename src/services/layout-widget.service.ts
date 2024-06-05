import { BaseCrudService } from '@abstracts/base-crud-service';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { Pagination } from '@models/pagination';
import { CastResponseContainer } from 'cast-response';

CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => LayoutWidgetModel,
    },
  },
  $default: {
    model: () => LayoutWidgetModel,
  },
});
@Injectable({
  providedIn: 'root',
})
export class LayoutWidgetService extends BaseCrudService<LayoutWidgetModel> {
  serviceName = 'WidgetService';

  protected getModelClass(): Constructor<LayoutWidgetModel> {
    return LayoutWidgetModel;
  }

  protected getModelInstance(): LayoutWidgetModel {
    return new LayoutWidgetModel();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LAYOUT_WIDGET;
  }
}
