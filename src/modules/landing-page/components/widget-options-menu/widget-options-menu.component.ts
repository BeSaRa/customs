import { WidgetState } from '@abstracts/widget-state';
import { OverlayRef } from '@angular/cdk/overlay';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { UntypedFormBuilder } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material/menu';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { InboxCounterService } from '@services/inbox-counter.service';
import { LangService } from '@services/lang.service';
import { WidgetOptionsService } from '@services/widget-options.service';
import { take, takeUntil } from 'rxjs';

@Component({
  selector: 'app-widget-options-menu',
  templateUrl: './widget-options-menu.component.html',
  styleUrl: './widget-options-menu.component.scss',
})
export class WidgetOptionsMenuComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  @ViewChild(MatMenuTrigger) private trigger!: MatMenuTrigger;

  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  optionsService = inject(WidgetOptionsService);
  inboxCountersService = inject(InboxCounterService);

  optionsForm = this.fb.group(this.optionsService.widgetState()!.buildFrom());
  // optionsForm = this.fb.group({ counterIds: [] });

  ngOnInit(): void {
    this.optionsForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(v => {
        this.optionsService.updateState(v as WidgetState);
      });
  }

  open($event: MouseEvent): void {
    $event?.preventDefault();

    const target = $event.target as unknown as HTMLElement;

    const name = target.localName;

    const parent = target.parentElement;
    const isTR = () => parent?.nodeName === 'TR';

    this.trigger.menuOpened.pipe(take(1)).subscribe(() => {
      parent && isTR() ? parent.classList.add('highlight') : null;
    });

    this.trigger.menuClosed.pipe(take(1)).subscribe(() => {
      parent && isTR() ? parent.classList.remove('highlight') : null;
    });

    !['input', 'button'].includes(name) &&
      (() => {
        this.trigger.openMenu();
        const { _overlayRef: overlayRef } = this.trigger as unknown as {
          _overlayRef: OverlayRef;
        };
        Promise.resolve().then(() =>
          overlayRef.setDirection(this.lang.getCurrent().direction),
        );
      })();
  }
}
