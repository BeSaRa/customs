import { Component, inject, OnDestroy } from '@angular/core';
import { InboxCounterService } from '@services/inbox-counter.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
  providers: [InboxCounterService],
})
export class LandingPageComponent implements OnDestroy {
  private _inboxCounterService = inject(InboxCounterService);

  ngOnDestroy(): void {
    this._inboxCounterService.stopPolling();
  }
}
