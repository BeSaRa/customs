import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { Observable } from 'rxjs';
import { Pagination } from '@models/pagination';
import { Team } from '@models/team';
import { InternalUser } from '@models/internal-user';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { UserCustomMenu } from '@models/user-custom-menu';
import { ComponentType } from '@angular/cdk/portal';
import { UserCustomMenusComponent } from '@modules/administration/components/user-custom-menus/user-custom-menus.component';
import { HttpParams } from '@angular/common/http';

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      'rs.*': () => Team,
    },
  },
  $default: {
    model: () => Team,
  },
  internalUser$: {
    model: () => InternalUser,
  },
})
@Injectable({
  providedIn: 'root',
})
export class UserCustomMenuService extends BaseCrudWithDialogService<
  UserCustomMenusComponent,
  UserCustomMenu
> {
  serviceName = 'UserCustomMenuService';
  protected getModelClass(): Constructor<UserCustomMenu> {
    return UserCustomMenu;
  }

  protected getModelInstance(): UserCustomMenu {
    return new UserCustomMenu();
  }

  protected override getDialogComponent(): ComponentType<UserCustomMenusComponent> {
    return UserCustomMenusComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_MENU_ITEM;
  }

  @CastResponse(undefined, {
    unwrap: 'rs',
    fallback: '$default',
  })
  loadUserCustomMenus(userId: number): Observable<UserCustomMenu[]> {
    return this.http.get<UserCustomMenu[]>(this.getUrlSegment(), {
      params: new HttpParams({
        fromObject: { internalUserId: userId },
      }),
    });
  }

  @CastResponse(undefined, {
    fallback: '$default',
    unwrap: 'rs',
  })
  saveUserCustomMenu(
    userId: number,
    data: number[],
  ): Observable<UserCustomMenu[]> {
    return this.http.post<UserCustomMenu[]>(
      this.getUrlSegment() + '/' + userId,
      data,
    );
  }
}
