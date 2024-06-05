import { LayoutWidgetModel } from '@models/layout-widget-model';
import { ModelInterceptorContract } from 'cast-response';

export class LayoutWidgetInterceptor
  implements ModelInterceptorContract<LayoutWidgetModel>
{
  send(model: Partial<LayoutWidgetModel>): Partial<LayoutWidgetModel> {
    return model;
  }

  receive(model: LayoutWidgetModel): LayoutWidgetModel {
    model.widgetDomId = model.id;
    return model;
  }
}
