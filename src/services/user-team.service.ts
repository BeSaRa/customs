import { Injectable, inject } from "@angular/core";
import { UserTeam } from "@models/user-team";
import { CastResponse, CastResponseContainer } from "cast-response";
import { BaseCrudWithDialogService } from "@abstracts/base-crud-with-dialog-service";
import { ComponentType } from "@angular/cdk/portal";
import { UserTeamPopupComponent } from "@modules/administration/popups/user-team-popup/user-team-popup.component";
import { Constructor } from "@app-types/constructors";
import { Pagination } from "@models/pagination";
import { FetchOptionsContract } from "@contracts/fetch-options-contract";
import { Observable } from "rxjs";
import { HttpParams } from "@angular/common/http";
import { TeamService } from "./team.service";

@CastResponseContainer({
  $pagination: {
    model: () => Pagination,
    shape: {
      "rs.*": () => UserTeam,
    },
  },
  $default: {
    model: () => UserTeam,
  },
})
@Injectable({
  providedIn: "root",
})
export class UserTeamService extends BaseCrudWithDialogService<
  UserTeamPopupComponent,
  UserTeam
> {
  serviceName = "UserTeamService";
  teamService = inject(TeamService);

  protected getModelClass(): Constructor<UserTeam> {
    return UserTeam;
  }

  protected getModelInstance(): UserTeam {
    return new UserTeam();
  }

  getDialogComponent(): ComponentType<UserTeamPopupComponent> {
    return UserTeamPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.USER_TEAM;
  }

  @CastResponse(undefined, {
    unwrap: "",
    fallback: "$pagination",
  })
  loadUserTeams(
    userId: number,
    options: FetchOptionsContract = {
      offset: 0,
      limit: 50,
    }
  ): Observable<Pagination<UserTeam[]>> {
    return this.http.get<Pagination<UserTeam[]>>(
      this.getUrlSegment() + `/${userId}`,
      {
        params: new HttpParams({
          fromObject: { ...options } as never,
        }),
      }
    );
  }

  saveUserTeam(userTeam: {
    internalUserId: number;
    teamId: number;
    status: number;
  }): Observable<unknown> {
    return this.http.post(
      this.teamService.getUrlSegment() + "/admin/add-user",
      userTeam
    );
  }

  override delete(id: number): Observable<UserTeam> {
    return this.http.delete<UserTeam>(
      this.teamService.getUrlSegment() + "/admin/remove-users/bulk",
      { body: [id] }
    );
  }
}
