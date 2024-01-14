import { ModelInterceptorContract } from 'cast-response';
import { SuspendedEmployee } from '@models/suspended-employee';
import { AdminResult } from '@models/admin-result';

export class SuspendedEmployeeInterceptor implements ModelInterceptorContract<SuspendedEmployee> {
  send(model: Partial<SuspendedEmployee>): Partial<SuspendedEmployee> {
    delete model.typeInfo;
    delete model.signerInfo;
    delete model.statusInfo;
    delete model.$$__lookupService__$$;
    delete model.$$__service_name__$$;
    return model;
  }

  receive(model: SuspendedEmployee): SuspendedEmployee {
    model.arName = model.arName ?? '';
    model.enName = model.enName ?? '';
    model.typeInfo && (model.typeInfo = AdminResult.createInstance(model.typeInfo));
    model.signerInfo && (model.signerInfo = AdminResult.createInstance(model.signerInfo));
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.dateFrom = model.dateFrom?.split('.')[0] ?? '';
    model.dateTo = model.dateTo?.split('.')[0] ?? '';
    model.decisionDate = model.decisionDate?.split('.')[0] ?? '';
    return model;
  }
}
