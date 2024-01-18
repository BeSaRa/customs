import { Injectable } from '@angular/core';
import { OrganizationUnit } from '@models/organization-unit';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { OrganizationUnitPopupComponent } from '@modules/administration/popups/organization-unit-popup/organization-unit-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { Observable, map } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { BlobModel } from '@models/blob-model';
import { HttpParams } from '@angular/common/http';
import { OuLogo } from '@models/ou_logo';
import { OrganizationUnitType } from '@enums/organization-unit-type';

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

  @CastResponse()
  loadOUsByType(
    type = OrganizationUnitType.SECTION,
  ): Observable<OrganizationUnit[]> {
    return this.http.get<OrganizationUnit[]>(
      this.getUrlSegment() + `/type/${type}`,
    );
  }

  downloadOuLogo(
    id: number,
    domSanitizer: DomSanitizer,
  ): Observable<BlobModel> {
    return this.http
      .post(
        this.getUrlSegment() + '/stamp/content',
        { departmentId: id },
        { responseType: 'blob' },
      )
      .pipe(map(blob => new BlobModel(blob, domSanitizer)));
  }

  uploadOuLogo(ouLogo: OuLogo): Observable<unknown> {
    const formData = new FormData();
    ouLogo.content ? formData.append('content', ouLogo.content) : null;
    delete ouLogo.content;
    return this.http.post(this.getUrlSegment() + '/stamp', formData, {
      params: new HttpParams({
        fromObject: ouLogo as never,
      }),
    });
  }
}
