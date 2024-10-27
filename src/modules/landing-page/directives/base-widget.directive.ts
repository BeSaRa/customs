import { Directive, inject } from '@angular/core';
import { WidgetOptionsService } from '@services/widget-options.service';

@Directive({})
export abstract class BaseWidgetDirective {
  optionsService = inject(WidgetOptionsService);

  get widgetCounters() {
    return this.optionsService.widgetCounters;
  }

  constructor() {
    this.optionsService.isMulti = this.isMulti();
  }

  abstract isMulti(): boolean;

  // protected abstract widgetOptions: WidgetOptionsContract;

  // getOptions() {
  //   return this.widgetOptions;
  // }
}
