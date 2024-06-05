import { WidgetModel } from '@models/widget-model';
import { ModelInterceptorContract } from 'cast-response';

export class WidgetInterceptor
  implements ModelInterceptorContract<WidgetModel>
{
  send(model: Partial<WidgetModel>): Partial<WidgetModel> {
    return model;
  }

  receive(model: WidgetModel): WidgetModel {
    return model;
  }
}
