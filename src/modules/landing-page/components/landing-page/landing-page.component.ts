import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { InboxCounterService } from '@services/inbox-counter.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss',
})
export class LandingPageComponent implements OnInit, OnDestroy {
  private _inboxCounterService = inject(InboxCounterService);

  ngOnInit(): void {
    this._inboxCounterService.startPolling();
  }

  ngOnDestroy(): void {
    this._inboxCounterService.stopPolling();
  }
}
