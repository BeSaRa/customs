import { BaseModel } from '@abstracts/base-model';
import { WidgetState } from '@abstracts/widget-state';
import { WidgetTypeToComponentMap } from '@contracts/widgets-map';
import { WidgetTypes } from '@enums/widget-types';
import { LayoutWidgetInterceptor } from '@model-interceptors/layout-widget-interceptor';
import { LayoutWidgetService } from '@services/layout-widget.service';
import { InterceptModel } from 'cast-response';
import { GridStackPosition } from 'gridstack';
import { WidgetModel } from './widget-model';

const { send, receive } = new LayoutWidgetInterceptor();

@InterceptModel({ send, receive })
export class LayoutWidgetModel extends BaseModel<
  LayoutWidgetModel,
  LayoutWidgetService
> {
  $$__service_name__$$ = 'LayoutWidgetService';

  layoutId!: number;
  widgetId!: number;

  position!: GridStackPosition;

  // corresponds the widget state
  stateOptions!: WidgetState;

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

  static getStateInstance(type: WidgetTypes, state: Partial<WidgetState>) {
    const _StateType = WidgetTypeToComponentMap[type].stateOptions;
    return new _StateType().clone(state);
  }
}
