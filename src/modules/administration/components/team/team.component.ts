import { Component, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Team } from '@models/team';
import { TeamService } from '@services/team.service';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss'],
})
export class TeamComponent extends AdminComponent<
  TeamPopupComponent,
  Team,
  TeamService
> {
  service = inject(TeamService);
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'status',
    'actions',
  ];
}
