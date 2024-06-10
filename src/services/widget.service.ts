import { BaseCrudService } from '@abstracts/base-crud-service';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { FetchOptionsContract } from '@contracts/fetch-options-contract';
import { SortOptionsContract } from '@contracts/sort-options-contract';
import { WidgetTypes } from '@enums/widget-types';
import { Pagination } from '@models/pagination';
import { WidgetModel } from '@models/widget-model';
import { CastResponseContainer } from 'cast-response';
import { Observable, tap } from 'rxjs';

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

  widgets: WidgetModel[] = [];

  private _widgetsByTypeMap = {} as Record<WidgetTypes, WidgetModel>;
  private _widgetsByIdMap = {} as Record<number, WidgetModel>;

  constructor() {
    super();
    this._setMaps();
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

  override load(
    options?: FetchOptionsContract,
    criteria?: Partial<WidgetModel> | undefined,
    sortOptions?: SortOptionsContract | undefined,
  ): Observable<Pagination<WidgetModel[]>> {
    return super.load(options, criteria, sortOptions).pipe(
      tap(rs => {
        this.widgets = rs.rs;
        this._setMaps();
      }),
    );
  }

  getWidgetByType(type: WidgetTypes) {
    return new WidgetModel().clone<WidgetModel>(
      structuredClone(this._widgetsByTypeMap[type]),
    );
  }

  getWidgetById(id: number) {
    return new WidgetModel().clone<WidgetModel>(
      structuredClone(this._widgetsByIdMap[id]),
    );
  }

  getWidgets() {
    return this.widgets;
  }

  private _setMaps() {
    this._widgetsByTypeMap = this.widgets.reduce(
      (acc, cur) => {
        acc[cur.type] = cur;
        return acc;
      },
      {} as Record<WidgetTypes, WidgetModel>,
    );

    this._widgetsByIdMap = this.widgets.reduce(
      (acc, cur) => {
        acc[cur.id] = cur;
        return acc;
      },
      {} as Record<number, WidgetModel>,
    );
  }
}
