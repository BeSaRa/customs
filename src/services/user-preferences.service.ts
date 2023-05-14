import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { UserPreferences } from '@models/user-preferences';
import { UserPreferencesPopupComponent } from '@modules/administration/popups/user-preferences-popup/user-preferences-popup.component';
import { CastResponseContainer, InterceptParam } from 'cast-response';
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
export class UserPreferencesService extends  BaseCrudWithDialogService<UserPreferencesPopupComponent, UserPreferences>{
  protected override getDialogComponent(): ComponentType<UserPreferencesPopupComponent> {
    return UserPreferencesPopupComponent
  }
  protected override getUrlSegment(): string {
    return this.urlService.URLS.USER_PREFERENCES;
  }
  protected override getModelInstance(): UserPreferences {
    return new UserPreferences()
  }
  protected override getModelClass(): Constructor<UserPreferences> {
    return UserPreferences
  }

  // _updateUserPreferences(generalUserId: number, @InterceptParam() model: UserPreferences): Observable<UserPreferences> {
  //   return this.http.post<UserPreferences>(this.getUrlSegment() + '/internal-user-id/' + generalUserId, model);
  // }

  // updateUserPreferences(generalUserId: number, model: UserPreferences): Observable<UserPreferences> {
  //   return this._updateUserPreferences(generalUserId, model);
  // }
}
