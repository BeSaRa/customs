import { WidgetModel } from '@models/widget-model';
import { ModelInterceptorContract } from 'cast-response';

export class WidgetInterceptor
  implements ModelInterceptorContract<WidgetModel>
{
  send(model: Partial<WidgetModel>): Partial<WidgetModel> {
    model.defaultSize = JSON.stringify(model.defaultSize) as unknown as {
      w: number;
      h: number;
    };
    return model;
  }

  receive(model: WidgetModel): WidgetModel {
    model.defaultSize = JSON.parse(
      (model.defaultSize as unknown as string) ?? '{}',
    );
    return model;
  }
}
