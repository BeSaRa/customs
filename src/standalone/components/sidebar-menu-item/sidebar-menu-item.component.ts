import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { SidebarMenuAnimation } from '@animations/sidebar-menu-animation';
import { FilterSidebarMenuItemPipe } from '@standalone/pipes/filter-sidebar-menu-item.pipe';
import { LangService } from '@services/lang.service';
import { takeUntil } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ShrinkAnimation } from '@animations/shrink-animation';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { SidebarComponent } from '@standalone/components/sidebar/sidebar.component';
import { Common } from '@models/common';
import { CommonService } from '@services/common.service';
import { CounterContract } from '@constants/counter-contract';

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    FilterSidebarMenuItemPipe,
    HighlightPipe,
  ],
  templateUrl: './sidebar-menu-item.component.html',
  styleUrls: ['./sidebar-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [SidebarMenuAnimation, ShrinkAnimation],
})
export class SidebarMenuItemComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  private _searchText = '';
  @Input()
  level!: number;
  @Input()
  item!: MenuItemContract;
  @Input()
  menuStatus: 'opened' | 'closed' = 'closed';
  cd = inject(ChangeDetectorRef);
  lang = inject(LangService);
  commonService = inject(CommonService);
  @Input()
  shrinkMode = false;

  sidebar = inject(SidebarComponent);

  @Input()
  set searchText(value) {
    this._searchText = value || '';
    value ? (this.menuStatus = 'opened') : (this.menuStatus = 'closed');
  }

  get searchText(): string {
    return this._searchText;
  }

  get hasChildren(): boolean {
    return !!(this.item.children && this.item.children.length);
  }
  hasCounter(s: keyof CounterContract | undefined): boolean {
    return s
      ? !!(
          this.commonService.counters() &&
          this.commonService.counters()![s] !== '0'
        )
      : false;
  }
  getCounter(s: keyof CounterContract | undefined): string {
    return s
      ? (this.commonService.counters() && this.commonService.counters()![s]) ??
          ''
      : '';
  }
  trackByLangKey(index: number, item: MenuItemContract) {
    return item.langKey;
  }

  toggleMenu(): void {
    this.menuStatus = this.menuStatus === 'opened' ? 'closed' : 'opened';
  }

  ngOnInit(): void {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.cd.markForCheck();
    });
  }
}
