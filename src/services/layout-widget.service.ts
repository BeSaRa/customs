import { BaseCrudService } from '@abstracts/base-crud-service';
import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { Pagination } from '@models/pagination';
import { WidgetModel } from '@models/widget-model';
import { CastResponseContainer } from 'cast-response';
import { map, of, take, tap } from 'rxjs';
import { LayoutService } from './layout.service';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => LayoutWidgetModel,
    },
  },
  $default: {
    model: () => LayoutWidgetModel,
  },
})
@Injectable({
  providedIn: 'root',
})
export class LayoutWidgetService extends BaseCrudService<LayoutWidgetModel> {
  serviceName = 'LayoutWidgetService';

  layoutService = inject(LayoutService);

  layoutWidgets: LayoutWidgetModel[] = [];
  private _layoutWidgetsMap: Record<string | number, LayoutWidgetModel> = {};
  private _layoutWidgetsMapSignal = signal(this._layoutWidgetsMap);
  layoutWidgetsMap = computed(this._layoutWidgetsMapSignal);

  private _layoutWidgetEffect = effect(
    () => {
      (this.layoutService.currentLayout()?.id
        ? this.load(
            undefined,
            { layoutId: this.layoutService.currentLayout()?.id },
            undefined,
          )
        : of({ count: 0, rs: [] })
      )
        .pipe(take(1))
        .subscribe(res => this.setLayoutWidgets(res.rs));
    },
    { allowSignalWrites: true },
  );

  protected getModelClass(): Constructor<LayoutWidgetModel> {
    return LayoutWidgetModel;
  }

  protected getModelInstance(): LayoutWidgetModel {
    return new LayoutWidgetModel();
  }

  getUrlSegment(): string {
    return this.urlService.URLS.LAYOUT_WIDGET;
  }

  patchLayoutWidgetsUpdate(layoutWidgets: LayoutWidgetModel[]) {
    if (!layoutWidgets.length && !this.layoutWidgets.length) return of([]);
    return (
      layoutWidgets.length
        ? this.createBulkFull(
            layoutWidgets.map(w => {
              delete (w as { id?: number }).id;
              return w;
            }),
          )
        : this.deleteBulk(this.layoutWidgets.map(item => item.id)).pipe(
            map(() => []),
          )
    ).pipe(
      take(1),
      tap(widgets => this.setLayoutWidgets(widgets)),
    );
  }

  setLayoutWidgets(layoutWidgets?: LayoutWidgetModel[]) {
    layoutWidgets && (this.layoutWidgets = layoutWidgets);
    this._layoutWidgetsMap = {};
    this.layoutWidgets.forEach(lw => {
      this._layoutWidgetsMap[lw.id] =
        new LayoutWidgetModel().clone<LayoutWidgetModel>(structuredClone(lw));
      this._layoutWidgetsMap[lw.id].widgetDetails =
        new WidgetModel().clone<WidgetModel>(structuredClone(lw.widgetDetails));
    });
    this._layoutWidgetsMapSignal.set(this._layoutWidgetsMap);
  }
}
