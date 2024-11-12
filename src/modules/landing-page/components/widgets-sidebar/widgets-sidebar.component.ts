import { Component, inject } from '@angular/core';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { GridService } from '@services/grid.service';
import { LangService } from '@services/lang.service';
import { SidebarService } from '@services/sidebar.service';
import { WidgetService } from '@services/widget.service';

@Component({
  selector: 'app-widgets-sidebar',
  templateUrl: './widgets-sidebar.component.html',
  styleUrl: './widgets-sidebar.component.scss',
})
export class WidgetsSidebarComponent extends OnDestroyMixin(class {}) {
  sidebarService = inject(SidebarService);
  lang = inject(LangService);
  gridService = inject(GridService);
  widgetService = inject(WidgetService);

  get direction() {
    return this.lang.getCurrent().direction === 'ltr' ? 'left' : 'right';
  }

  get width() {
    return this.sidebarService.isOpened() ? 300 : 75;
  }

  get isShown() {
    return !this.gridService.isStatic;
  }

  get isOpened() {
    return this.sidebarService.isOpened();
  }

  getSideBarStyles() {
    return {
      [this.direction]: this.isShown ? 0 : this.width * -1 + 'px',
    };
  }
}
