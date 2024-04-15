import { Component, input } from '@angular/core';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { ActivitiesName } from '@enums/activities-name';

@Component({
  selector: 'app-review-minutes',
  standalone: true,
  imports: [],
  templateUrl: './review-minutes.component.html',
  styleUrl: './review-minutes.component.scss',
})
export class ReviewMinutesComponent extends OnDestroyMixin(class {}) {
  model = input.required<Investigation>();
  protected readonly ActivitiesName = ActivitiesName;
}
