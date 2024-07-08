import { ModelInterceptorContract } from 'cast-response';
import { InternalUser } from '@models/internal-user';
import { UserPreferences } from '@models/user-preferences';
import { UserPreferencesInterceptor } from './user-preferences-interceptor';
import { AdminResult } from '@models/admin-result';
import { MawaredEmployee } from '@models/mawared-employee';
import { MawaredEmployeeInterceptor } from '@model-interceptors/mawared-employee-interceptor';
import { ManagerDelegationInterceptor } from '@model-interceptors/manager-delegation-interceptor';
import { ManagerDelegation } from '@models/manager-delegation';

const userPreferencesInterceptor = new UserPreferencesInterceptor();
const mawaredEmployeeInterceptor = new MawaredEmployeeInterceptor();
const managerDelegationInterceptor = new ManagerDelegationInterceptor();

export class InternalUserInterceptor
  implements ModelInterceptorContract<InternalUser>
{
  send(model: Partial<InternalUser>): Partial<InternalUser> {
    model.userPreferences &&
      (model.userPreferences = userPreferencesInterceptor.send(
        model.userPreferences,
      ) as UserPreferences);
    model.managerDelegation &&
      (model.managerDelegation = managerDelegationInterceptor.send(
        model.managerDelegation,
      ) as ManagerDelegation);
    delete model.defaultDepartmentInfo;
    delete model.departmentInfo;
    delete model.jobTitleInfo;
    return model;
  }

  receive(model: InternalUser): InternalUser {
    model.defaultDepartmentInfo = AdminResult.createInstance(
      model.defaultDepartmentInfo,
    );
    model.departmentInfo = AdminResult.createInstance(model.departmentInfo);
    model.jobTitleInfo = AdminResult.createInstance(model.jobTitleInfo);
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.mawaredEmployeeInfo = mawaredEmployeeInterceptor.receive(
      new MawaredEmployee().clone<MawaredEmployee>(model.mawaredEmployeeInfo),
    );
    model.userPreferences &&
      (model.userPreferences = userPreferencesInterceptor.receive(
        new UserPreferences().clone<UserPreferences>(model.userPreferences),
      ));
    model.managerDelegation &&
      (model.managerDelegation = managerDelegationInterceptor.receive(
        new ManagerDelegation().clone<ManagerDelegation>(
          model.managerDelegation,
        ),
      ));
    return model;
  }
}
