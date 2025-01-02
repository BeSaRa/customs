import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { TeamNames } from '@enums/team-names';
import { InternalUser } from '@models/internal-user';
import { Pagination } from '@models/pagination';
import { Team } from '@models/team';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { CastResponse, CastResponseContainer } from 'cast-response';

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
export class TeamService extends BaseCrudWithDialogService<
  TeamPopupComponent,
  Team
> {
  serviceName = 'TeamService';

  protected getModelClass(): Constructor<Team> {
    return Team;
  }

  protected getModelInstance(): Team {
    return new Team();
  }

  getDialogComponent(): ComponentType<TeamPopupComponent> {
    return TeamPopupComponent;
  }

  getUrlSegment(): string {
    return this.urlService.URLS.TEAM;
  }

  @CastResponse(() => Team, {
    unwrap: 'rs',
  })
  loadDepartmentTeams(ouId: number) {
    return this.http.get<Team[]>(
      this.getUrlSegment() + `/department-teams/lookup`,
      { params: new HttpParams({ fromObject: { ouId } }) },
    );
  }

  @CastResponse(() => InternalUser, {
    unwrap: 'rs',
    fallback: 'internalUser$',
  })
  loadTeamMembers(authName: TeamNames, ouId: number) {
    const params = new HttpParams().set('ouId', ouId);

    return this.http.get<InternalUser[]>(
      `${this.getUrlSegment()}/members/auth/${authName}`,
      { params },
    );
  }

  @CastResponse(() => InternalUser, {
    unwrap: 'rs',
    fallback: 'internalUser$',
  })
  loadTeamMembersById(teamId: number, ouId?: number) {
    return this.http.get<InternalUser[]>(
      this.getUrlSegment() + `/members/${teamId}`,
      { params: new HttpParams({ fromObject: ouId ? { ouId } : {} }) },
    );
  }

  @CastResponse(() => InternalUser, {
    unwrap: 'rs',
    fallback: 'internalUser$',
  })
  loadDCTeamMembers() {
    return this.http.get<InternalUser[]>(this.getUrlSegment() + `/dc-members`);
  }
}
