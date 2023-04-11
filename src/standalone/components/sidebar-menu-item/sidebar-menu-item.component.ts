import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { SidebarMenuAnimation } from '../../../animsations/sidebar-menu-animation';
import { FilterSidebarMenuItemPipe } from '@standalone/pipes/filter-sidebar-menu-item.pipe';

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    RouterLinkActive,
    RouterLink,
    FilterSidebarMenuItemPipe,
  ],
  templateUrl: './sidebar-menu-item.component.html',
  styleUrls: ['./sidebar-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [SidebarMenuAnimation],
})
export class SidebarMenuItemComponent {
  @Input()
  level!: number;
  @Input()
  item!: MenuItemContract;
  @Input()
  menuStatus: 'opened' | 'closed' = 'closed';

  private _searchText = '';

  @Input()
  set searchText(value) {
    this._searchText = value || '';
  }

  get searchText(): string {
    return this._searchText;
  }

  get hasChildren(): boolean {
    return !!(this.item.children && this.item.children.length);
  }

  trackByLangKey(index: number, item: MenuItemContract) {
    return item.langKey;
  }

  toggleMenu(): void {
    this.menuStatus = this.menuStatus === 'opened' ? 'closed' : 'opened';
  }
}
