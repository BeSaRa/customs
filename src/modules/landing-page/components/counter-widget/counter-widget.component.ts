import { WidgetState } from '@abstracts/widget-state';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { InobxCounterTypes } from '@enums/inbox-counter-types';
import { BaseWidgetDirective } from '@modules/landing-page/directives/base-widget.directive';

export class CounterWidgetState extends WidgetState {}

@Component({
  selector: 'app-counter-widget',
  templateUrl: './counter-widget.component.html',
  styleUrl: './counter-widget.component.scss',
})
export class CounterWidgetComponent extends BaseWidgetDirective {
  router = inject(Router);
  override _isMulti() {
    return false;
  }

  counter = computed(() => this.widgetCounters()[0]);

  navigate() {
    if (this.counter().counterId === InobxCounterTypes.PERSONAL_INBOX) {
      this.router.navigate([AppFullRoutes.USER_INBOX]);
    } else {
      this.router.navigate([AppFullRoutes.TEAM_INBOX], {
        queryParams: {
          teamId: this.counter().teamId,
          counterId: this.counter().counterId,
        },
      });
    }
  }
}
