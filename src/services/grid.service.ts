import {
  computed,
  effect,
  inject,
  Injectable,
  Injector,
  runInInjectionContext,
  signal,
} from '@angular/core';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { generateUUID } from '@utils/utils';
import { GridStack, GridStackPosition } from 'gridstack';
import { take } from 'rxjs';
import { LayoutWidgetService } from './layout-widget.service';

@Injectable({
  providedIn: 'root',
})
export class GridService {
  static readonly COLUMNS_COUNT = 96;

  private _activeGrid = signal<GridStack | undefined>(undefined);
  activeGrid = computed(() => this._activeGrid());

  private layoutWidgetService = inject(LayoutWidgetService);
  private _injector = inject(Injector);

  private _widgetsMap: Record<string | number, LayoutWidgetModel> =
    this.layoutWidgetService.layoutWidgetsMap();

  private _widgetsSignal = signal<LayoutWidgetModel[]>(
    Object.values(this._widgetsMap),
  );
  widgets = computed(() => this._widgetsSignal());

  private _isStatic = false;
  get isStatic() {
    return this._isStatic;
  }

  constructor() {
    this.listenToLayoutWidgetsChange();
  }

  listenToLayoutWidgetsChange() {
    runInInjectionContext(this._injector, () =>
      effect(
        () => {
          this._activeGrid()?.removeAll(false, true);
          this._widgetsMap = this.layoutWidgetService.layoutWidgetsMap();
          this._setWidgetsSignal();
        },
        { allowSignalWrites: true },
      ),
    );
  }

  setActiveGrid(grid: GridStack | undefined) {
    this._activeGrid.set(grid);
  }

  addWidget(widget: Partial<LayoutWidgetModel>) {
    const _uuid = widget.id ?? generateUUID();
    this._widgetsMap[_uuid] = new LayoutWidgetModel().clone<LayoutWidgetModel>({
      widgetDomId: _uuid,
      ...widget,
    });
    this._setWidgetsSignal();
  }

  updateWidgets(updatedWidgets: Record<string | number, GridStackPosition>) {
    Object.keys(updatedWidgets).forEach(k => {
      this._widgetsMap[k].position = updatedWidgets[k];
    });
    this._setWidgetsSignal();
  }

  removeWidget(widgetId: string | number) {
    delete this._widgetsMap[widgetId];
    this._setWidgetsSignal();
  }

  enableEdit() {
    this._activeGrid()?.setStatic(false);
    this._isStatic = false;
  }

  disableEdit() {
    this._activeGrid()?.setStatic(true);
    this._isStatic = true;
  }

  saveChanges() {
    this.layoutWidgetService
      .patchLayoutWidgetsUpdate(Object.values(this._widgetsMap))
      .pipe(take(1))
      .subscribe(() => {
        this._activeGrid()?.setStatic(true);
        this._isStatic = true;
      });
  }

  revertChanges() {
    this.layoutWidgetService.setLayoutWidgets();
    this._activeGrid()?.setStatic(true);
    this._isStatic = true;
  }

  private _setWidgetsSignal() {
    this._widgetsSignal.set(Object.values(this._widgetsMap));
  }
}
