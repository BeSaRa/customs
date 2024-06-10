import { WidgetState } from '@abstracts/widget-state';
import { WidgetTypeToComponentMap } from '@contracts/widgets-map';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { ServiceRegistry } from '@services/service-registry';
import { WidgetService } from '@services/widget.service';
import { ModelInterceptorContract } from 'cast-response';
import { GridStackPosition } from 'gridstack';

export class LayoutWidgetInterceptor
  implements ModelInterceptorContract<LayoutWidgetModel>
{
  send(model: Partial<LayoutWidgetModel>): Partial<LayoutWidgetModel> {
    model.status = model.status ?? 1;
    delete model.widgetDetails;
    delete model.widgetDomId;
    model.position = JSON.stringify(
      model.position,
    ) as unknown as GridStackPosition;
    model.stateOptions = JSON.stringify(
      model.stateOptions,
    ) as unknown as WidgetState;
    return model;
  }

  receive(model: LayoutWidgetModel): LayoutWidgetModel {
    if (!model.id) return model;
    const _widgetService = ServiceRegistry.get<WidgetService>('WidgetService');
    model.widgetDomId = model.id;
    model.widgetDetails = _widgetService.getWidgetById(model.widgetId);
    model.position = JSON.parse((model.position as unknown as string) ?? '{}');

    const StateType =
      WidgetTypeToComponentMap[model.widgetDetails.type].stateOptions;
    model.stateOptions = new StateType().clone(
      JSON.parse((model.stateOptions as unknown as string) ?? '{}'),
    );

    return model;
  }
}
