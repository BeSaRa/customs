import { ModelInterceptorContract } from 'cast-response';
import { OrganizationUnit } from '@models/organization-unit';
import { AdminResult } from '@models/admin-result';

export class OrganizationUnitInterceptor implements ModelInterceptorContract<OrganizationUnit> {
  send(model: Partial<OrganizationUnit>): Partial<OrganizationUnit> {
    delete model.statusInfo;
    delete model.managerInfo;
    delete model.typeInfo;
    delete model.parentInfo;
    delete model.mawaredDepInfo;

    return model;
  }

  receive(model: OrganizationUnit): OrganizationUnit {
    model.statusInfo && (model.statusInfo = AdminResult.createInstance(model.statusInfo));
    model.managerInfo && (model.managerInfo = AdminResult.createInstance(model.managerInfo));
    model.typeInfo && (model.typeInfo = AdminResult.createInstance(model.typeInfo));
    model.parentInfo && (model.parentInfo = AdminResult.createInstance(model.parentInfo));
    model.mawaredDepInfo && (model.mawaredDepInfo = AdminResult.createInstance(model.mawaredDepInfo));
    model.assistantInfo && (model.assistantInfo = AdminResult.createInstance(model.assistantInfo));

    return model;
  }
}
