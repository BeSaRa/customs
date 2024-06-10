import { BaseModel } from '@abstracts/base-model';
import { WidgetTypeToComponentMap } from '@contracts/widgets-map';
import { WidgetTypes } from '@enums/widget-types';
import { WidgetInterceptor } from '@model-interceptors/widget-interceptor';
import { WidgetService } from '@services/widget.service';
import { InterceptModel } from 'cast-response';

const { send, receive } = new WidgetInterceptor();

@InterceptModel({ send, receive })
export class WidgetModel extends BaseModel<WidgetModel, WidgetService> {
  $$__service_name__$$ = 'WidgetService';

  type!: WidgetTypes;
  defaultSize!: { w: number; h: number };

  statusDateModified!: string;

  getDefaultSize() {
    return {
      w:
        this.defaultSize?.w ||
        WidgetTypeToComponentMap[this.type].initialSize.w,
      h:
        this.defaultSize?.h ||
        WidgetTypeToComponentMap[this.type].initialSize.h,
    };
  }

  getWidgetIconUrl() {
    return WidgetTypeToComponentMap[this.type].iconUrl;
  }
}
