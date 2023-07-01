import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { inject, Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { UserPreferences } from '@models/user-preferences';
import { UserPreferencesPopupComponent } from '@modules/administration/popups/user-preferences-popup/user-preferences-popup.component';
import { CastResponse, CastResponseContainer, HasInterception, InterceptParam } from 'cast-response';
import { EmployeeService } from './employee.service';
import { Observable } from 'rxjs';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => UserPreferences,
    },
  },
  $default: {
    model: () => UserPreferences,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserPreferencesService extends BaseCrudWithDialogService<UserPreferencesPopupComponent, UserPreferences> {
  override serviceName = 'UserPreferencesService';

  protected employee = inject(EmployeeService).getEmployee();

  protected override getDialogComponent(): ComponentType<UserPreferencesPopupComponent> {
    return UserPreferencesPopupComponent;
  }
  protected override getUrlSegment(): string {
    return this.urlService.URLS.USER_PREFERENCES;
  }
  protected override getModelInstance(): UserPreferences {
    return new UserPreferences();
  }
  protected override getModelClass(): Constructor<UserPreferences> {
    return UserPreferences;
  }

  @HasInterception
  @CastResponse()
  save(@InterceptParam() model: UserPreferences): Observable<UserPreferences> {
    return this.http.post<UserPreferences>(this.urlService.URLS.USER_PREFERENCES + `/${this.employee?.id}`, model);
  }
}
