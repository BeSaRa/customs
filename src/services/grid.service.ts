import { computed, inject, Injectable, signal } from '@angular/core';
import { WidgetTypes } from '@enums/widget-types';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { generateUUID } from '@utils/utils';
import { GridStack, GridStackPosition } from 'gridstack';
import { WidgetService } from './widget.service';
import { WidgetModel } from '@models/widget-model';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  static readonly COLUMNS_COUNT = 96;

  private _activeGrid = signal<GridStack | undefined>(undefined);
  activeGrid = computed(() => this._activeGrid());

  private widgetService = inject(WidgetService);

  private test: Record<string | number, LayoutWidgetModel>[] = [
    {
      1: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 1,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.BAR_CHART),
        widgetDomId: 1,
        position: { x: 48, y: 0, w: 40, h: 24 },
        status: 1,
      }),
      2: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 2,
        widgetDomId: 2,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.PIE_CHART),
        position: { x: 16, y: 0, w: 24, h: 24 },
        status: 1,
      }),
      3: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 3,
        widgetDomId: 3,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.PIE_CHART),
        position: { x: 64, y: 24, w: 24, h: 24 },
        status: 1,
      }),
      4: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 4,
        widgetDomId: 4,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.BAR_CHART),
        position: { x: 16, y: 24, w: 40, h: 24 },
        status: 1,
      }),
    },
    {
      1: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 1,
        widgetDomId: 1,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.PIE_CHART),
        position: { x: 0, y: 0, w: 24, h: 24 },
        status: 1,
      }),
      2: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 2,
        widgetDomId: 2,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.PIE_CHART),
        position: { x: 32, y: 0, w: 24, h: 24 },
        status: 1,
      }),
      3: new LayoutWidgetModel().clone<LayoutWidgetModel>({
        id: 3,
        widgetDomId: 3,
        widgetDetails: this.widgetService.getWidget(WidgetTypes.PIE_CHART),
        position: { x: 64, y: 0, w: 24, h: 24 },
        status: 1,
      }),
    },
  ];

  private _widgetsMap: Record<string | number, LayoutWidgetModel> = {
    ...this.test[0],
  };
  private _currentLayoutBeforeEditing: Record<
    string | number,
    LayoutWidgetModel
  > = {};
  private _currentLayoutIndex = 0;
  private _widgetsSignal = signal<LayoutWidgetModel[]>(
    Object.values(this._widgetsMap),
  );
  widgets = computed(() => this._widgetsSignal());

  private _isStatic = false;
  get isStatic() {
    return this._isStatic;
  }

  setActiveGrid(grid: GridStack | undefined) {
    this._activeGrid.set(grid);
  }

  switch(layout: number) {
    this._currentLayoutIndex = layout;
    this._activeGrid()?.removeAll(false, true);
    setTimeout(() => {
      this._widgetsMap = this.test[layout];
      this._setWidgetsSignal();
    }, 0);
  }

  addWidget(widget: Partial<LayoutWidgetModel>) {
    const _uuid = widget.id ?? generateUUID();
    this._widgetsMap[_uuid] = new LayoutWidgetModel().clone<LayoutWidgetModel>({
      widgetDomId: _uuid,
      ...widget,
    });
    // console.log(this._widgetsMap[_uuid]);
    this._setWidgetsSignal();
  }

  patchWidgetsUpdates(
    updatedWidgets: Record<string | number, GridStackPosition>,
  ) {
    Object.keys(updatedWidgets).forEach(k => {
      this._widgetsMap[k].position = updatedWidgets[k];
    });
    this._setWidgetsSignal();
  }

  removeWidget(widgetId: string | number) {
    delete this._widgetsMap[widgetId];
    this._setWidgetsSignal();
  }

  clear() {
    this._widgetsMap = {};
    // this._widgetsSignal.set([]);
  }

  enable() {
    this._setCurrentLayout();
    this._activeGrid()?.setStatic(false);
    this._isStatic = false;
  }

  disable() {
    this._activeGrid()?.setStatic(true);
    this._isStatic = true;
  }

  revert() {
    this.test[this._currentLayoutIndex] = this._currentLayoutBeforeEditing;
    this.switch(this._currentLayoutIndex);
    this._activeGrid()?.setStatic(true);
    this._isStatic = true;
  }

  private _setWidgetsSignal() {
    this._widgetsSignal.set(Object.values(this._widgetsMap));
  }

  private _setCurrentLayout() {
    this._currentLayoutBeforeEditing = {};
    Object.keys(this._widgetsMap).forEach(k => {
      this._currentLayoutBeforeEditing[k] =
        new LayoutWidgetModel().clone<LayoutWidgetModel>(
          structuredClone(this._widgetsMap[k]),
        );
      this._currentLayoutBeforeEditing[k].widgetDetails =
        new WidgetModel().clone<WidgetModel>(
          structuredClone(this._widgetsMap[k].widgetDetails),
        );
    });
  }
}
