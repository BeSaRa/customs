import { BaseCrudService } from '@abstracts/base-crud-service';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { WidgetTypeToComponentMap } from '@contracts/widgets-map';
import { WidgetTypes } from '@enums/widget-types';
import { Pagination } from '@models/pagination';
import { WidgetModel } from '@models/widget-model';
import { CastResponseContainer } from 'cast-response';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => WidgetModel,
    },
  },
  $default: {
    model: () => WidgetModel,
  },
})
@Injectable({
  providedIn: 'root',
})
export class WidgetService extends BaseCrudService<WidgetModel> {
  serviceName = 'WidgetService';

  widgets = {
    [WidgetTypes.BAR_CHART]: new WidgetModel().clone<WidgetModel>({
      id: 1,
      type: WidgetTypes.BAR_CHART,
      defaultSize: {
        w: WidgetTypeToComponentMap[WidgetTypes.BAR_CHART].initialSize.w!,
        h: WidgetTypeToComponentMap[WidgetTypes.BAR_CHART].initialSize.h!,
      },
      status: 1,
    }),
    [WidgetTypes.PIE_CHART]: new WidgetModel().clone<WidgetModel>({
      id: 2,
      type: WidgetTypes.PIE_CHART,
      defaultSize: {
        w: WidgetTypeToComponentMap[WidgetTypes.PIE_CHART].initialSize.w!,
        h: WidgetTypeToComponentMap[WidgetTypes.PIE_CHART].initialSize.h!,
      },
      status: 1,
    }),
    [WidgetTypes.COUNTER]: new WidgetModel().clone<WidgetModel>({
      id: 3,
      type: WidgetTypes.COUNTER,
      defaultSize: {
        w: WidgetTypeToComponentMap[WidgetTypes.COUNTER].initialSize.w!,
        h: WidgetTypeToComponentMap[WidgetTypes.COUNTER].initialSize.h!,
      },
      status: 1,
    }),
  };

  getWidget(type: WidgetTypes) {
    return new WidgetModel().clone<WidgetModel>(
      structuredClone(this.widgets[type]),
    );
  }

  getWidgets() {
    return Object.values(this.widgets);
  }

  protected getModelClass(): Constructor<WidgetModel> {
    return WidgetModel;
  }

  protected getModelInstance(): WidgetModel {
    return new WidgetModel();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.WIDGET;
  }
}
