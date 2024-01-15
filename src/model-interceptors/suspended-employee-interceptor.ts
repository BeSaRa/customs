import { ModelInterceptorContract } from 'cast-response';
import { SuspendedEmployee } from '@models/suspended-employee';
import { AdminResult } from '@models/admin-result';
import { MawaredEmployee } from '@models/mawared-employee';

export class SuspendedEmployeeInterceptor implements ModelInterceptorContract<SuspendedEmployee> {
  send(model: Partial<SuspendedEmployee>): Partial<SuspendedEmployee> {
    delete model.typeInfo;
    delete model.signerInfo;
    delete model.statusInfo;
    delete model.mawaredEmployeeIdInfo;
    delete model.$$__lookupService__$$;
    delete model.$$__service_name__$$;
    return model;
  }

  receive(model: SuspendedEmployee): SuspendedEmployee {
    model.arName = model.mawaredEmployeeIdInfo.arName ?? '';
    model.enName = model.mawaredEmployeeIdInfo.enName ?? '';
    model.mawaredEmployeeIdInfo && (model.mawaredEmployeeIdInfo = MawaredEmployee.createInstance(model.mawaredEmployeeIdInfo));
    model.mawaredEmployeeIdInfo.employeeDepartmentInfo &&
      (model.mawaredEmployeeIdInfo.employeeDepartmentInfo = AdminResult.createInstance(model.mawaredEmployeeIdInfo.employeeDepartmentInfo));
    model.typeInfo && (model.typeInfo = AdminResult.createInstance(model.typeInfo));
    model.signerInfo && (model.signerInfo = AdminResult.createInstance(model.signerInfo));
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.dateFrom = model.dateFrom?.split('.')[0] ?? '';
    model.dateTo = model.dateTo?.split('.')[0] ?? '';
    model.decisionDate = model.decisionDate?.split('.')[0] ?? '';
    console.log('model: ', model);
    return model;
  }
}
