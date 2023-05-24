import { ModelInterceptorContract } from 'cast-response';
import { OrganizationUnit } from '@models/organization-unit';
import { AdminResult } from '@models/admin-result';

export class OrganizationUnitInterceptor implements ModelInterceptorContract<OrganizationUnit> {
  send(model: Partial<OrganizationUnit>): Partial<OrganizationUnit> {
    return model;
  }

  receive(model: OrganizationUnit): OrganizationUnit {
    model.statusInfo = new AdminResult().clone(model.statusInfo);
    model.typeInfo = new AdminResult().clone(model.typeInfo);
    model.managerInfo = new AdminResult().clone(model.managerInfo);
    model.parentInfo = new AdminResult().clone(model.parentInfo);
    model.mainTeam = new AdminResult().clone(model.mainTeam);

    return model;
  }
}
