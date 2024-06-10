import { LayoutModel } from '@models/layout-model';
import { EmployeeService } from '@services/employee.service';
import { ServiceRegistry } from '@services/service-registry';
import { ModelInterceptorContract } from 'cast-response';

export class LayoutInterceptor
  implements ModelInterceptorContract<LayoutModel>
{
  send(model: Partial<LayoutModel>): Partial<LayoutModel> {
    model.userId =
      model.userId ??
      ServiceRegistry.get<EmployeeService>('EmployeeService').loggedInUserId;
    model.status = model.status ?? 1;
    return model;
  }

  receive(model: LayoutModel): LayoutModel {
    return model;
  }
}
