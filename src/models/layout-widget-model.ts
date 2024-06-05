import { BaseModel } from '@abstracts/base-model';
import { WidgetState } from '@abstracts/widget-state';
import { LayoutWidgetService } from '@services/layout-widget.service';
import { GridStackPosition } from 'gridstack';
import { WidgetModel } from './widget-model';

export class LayoutWidgetModel extends BaseModel<
  LayoutWidgetModel,
  LayoutWidgetService
> {
  $$__service_name__$$ = 'LayoutWidgetService';

  layoutId!: number;
  widgetId!: number;

  position!: GridStackPosition;

  // corresponds the widget state
  options!: WidgetState;

  statusDateModified!: string;

  // not related to the model
  widgetDomId!: string | number;
  widgetDetails!: WidgetModel;

  getPosition(): GridStackPosition {
    return {
      x: this.position.x ?? 0,
      y: this.position.y ?? 0,
      w: this.position.w ?? this.widgetDetails?.getDefaultSize()?.w ?? 0,
      h: this.position.h ?? this.widgetDetails?.getDefaultSize()?.h ?? 0,
    };
  }
}
