import { Component, input } from '@angular/core';
import { Investigation } from '@models/investigation';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MeetingMinutesComponent } from '@standalone/components/meeting-minutes/meeting-minutes.component';
import { MeetingsListComponent } from '@standalone/components/meetings-list/meetings-list.component';

@Component({
  selector: 'app-disciplinary-committee',
  standalone: true,
  imports: [MeetingMinutesComponent, MeetingsListComponent],
  templateUrl: './disciplinary-committee.component.html',
  styleUrl: './disciplinary-committee.component.scss',
})
export class DisciplinaryCommitteeComponent extends OnDestroyMixin(class {}) {
  model = input.required<Investigation>();
}
