import { Directive, inject } from '@angular/core';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { GridService } from '@services/grid.service';
import { LangService } from '@services/lang.service';
import { WidgetOptionsService } from '@services/widget-options.service';

@Directive({})
export abstract class BaseWidgetDirective extends OnDestroyMixin(class {}) {
  optionsService = inject(WidgetOptionsService);
  gridService = inject(GridService);
  lang = inject(LangService);

  get widgetCounters() {
    return this.optionsService.widgetCounters;
  }

  get isEditMode() {
    return !this.gridService.isStatic;
  }

  constructor() {
    super();
    this.optionsService.isMulti = this._isMulti();
  }

  abstract _isMulti(): boolean;
}
