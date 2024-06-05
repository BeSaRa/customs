import { Component, inject, OnInit } from '@angular/core';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { GridService } from '@services/grid.service';
import { LangService } from '@services/lang.service';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-widgets-sidebar',
  templateUrl: './widgets-sidebar.component.html',
  styleUrl: './widgets-sidebar.component.scss',
})
export class WidgetsSidebarComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  gridService = inject(GridService);

  direction: 'left' | 'right' = 'right';
  width = 300;

  get isOpened() {
    return !this.gridService.isStatic;
  }

  ngOnInit(): void {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(lang => {
      this.direction = lang.direction === 'ltr' ? 'left' : 'right';
    });
  }

  getSideBarStyles() {
    return {
      [this.direction]: this.isOpened ? 0 : this.width * -1 + 'px',
    };
  }
}
