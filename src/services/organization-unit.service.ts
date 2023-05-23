import { Injectable } from '@angular/core';
import { OrganizationUnit } from '@models/organization-unit';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { OrganizationUnitPopupComponent } from '@modules/administration/popups/organization-unit-popup/organization-unit-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => OrganizationUnit,
    },
  },
  $default: {
    model: () => OrganizationUnit,
  },
})
@Injectable({
  providedIn: 'root',
})
export class OrganizationUnitService extends BaseCrudWithDialogService<
  OrganizationUnitPopupComponent,
  OrganizationUnit
> {
  override serviceName = 'OrganizationUnitService';
  protected getModelClass(): Constructor<OrganizationUnit> {
    return OrganizationUnit;
  }

  protected getModelInstance(): OrganizationUnit {
    return new OrganizationUnit();
  }

  getDialogComponent(): ComponentType<OrganizationUnitPopupComponent> {
    return OrganizationUnitPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.ORGANIZATION_UNIT;
  }
}
