import { Injectable } from '@angular/core';
import { Team } from '@models/team';
import { CastResponse, CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';
import { TeamNames } from '@enums/team-names';
import { InternalUser } from '@models/internal-user';

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

  @CastResponse(() => InternalUser, {
    unwrap: 'rs',
    fallback: 'internalUser$',
  })
  loadTeamMembers(authName: TeamNames) {
    return this.http.get<InternalUser[]>(
      this.getUrlSegment() + `/members/auth/${authName}`,
    );
  }

  @CastResponse(() => InternalUser, {
    unwrap: 'rs',
    fallback: 'internalUser$',
  })
  loadTeamMembersById(teamId: number) {
    return this.http.get<InternalUser[]>(
      this.getUrlSegment() + `/members/${teamId}`,
    );
  }
}
