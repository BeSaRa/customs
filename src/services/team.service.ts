import { Injectable } from '@angular/core';
import { Team } from '@models/team';
import { CastResponseContainer } from 'cast-response';
import { BaseCrudWithDialogService } from '@abstracts/base-crud-with-dialog-service';
import { ComponentType } from '@angular/cdk/portal';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { Constructor } from '@app-types/constructors';
import { Pagination } from '@models/pagination';

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
})
@Injectable({
  providedIn: 'root',
})
export class TeamService extends BaseCrudWithDialogService<TeamPopupComponent, Team> {
  protected override getAuditDialogComponent(): ComponentType<TeamPopupComponent> {
    throw new Error('Method not implemented.');
  }
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
}
