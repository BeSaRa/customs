import { Component, input } from '@angular/core';
import { Investigation } from '@models/investigation';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MeetingsListComponent } from '@standalone/components/meetings-list/meetings-list.component';
import { PersonsListComponent } from '@standalone/components/legal-affairs-offenders/persons-list.component';
import { MeetingMinutesComponent } from '@standalone/components/meeting-minutes/meeting-minutes.component';
import { DecisionMinutesComponent } from '@standalone/components/decision-minutes/decision-minutes.component';
import { ActivitiesName } from '@enums/activities-name';
import { MeetingMinutes } from '@models/meeting-minutes';

@Component({
  selector: 'app-disciplinary-committee',
  standalone: true,
  imports: [
    MeetingsListComponent,
    PersonsListComponent,
    MeetingMinutesComponent,
    DecisionMinutesComponent,
  ],
  templateUrl: './disciplinary-committee.component.html',
  styleUrl: './disciplinary-committee.component.scss',
})
export class DisciplinaryCommitteeComponent extends OnDestroyMixin(class {}) {
  model = input.required<Investigation>();
  protected readonly ActivitiesName = ActivitiesName;
  meetingMinutesList: MeetingMinutes[] = [];
}
