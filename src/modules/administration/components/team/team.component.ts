import { AdminComponent } from '@abstracts/admin-component';
import { Component, inject } from '@angular/core';
import { NamesContract } from '@contracts/names-contract';
import { Team } from '@models/team';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { TeamService } from '@services/team.service';

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

  filterValue: Partial<NamesContract> = {};
  onFilterChange(names: Partial<NamesContract>) {
    this.filterValue = names;
    this.filter$.next(names);
  }
}
