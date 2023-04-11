import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MenuItemContract } from '@contracts/menu-item-contract';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-sidebar-menu-item',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLinkActive, RouterLink],
  templateUrl: './sidebar-menu-item.component.html',
  styleUrls: ['./sidebar-menu-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('openClose', [
      state(
        'closed',
        style({
          height: 0,
          opacity: 0,
        })
      ),
      state(
        'opened',
        style({
          height: '*',
          opacity: 1,
        })
      ),
      transition('* <=> *', animate('150ms ease-in-out')),
    ]),
  ],
})
export class SidebarMenuItemComponent {
  @Input()
  level!: number;
  @Input()
  item!: MenuItemContract;

  menuStatus: 'opened' | 'closed' = 'closed';

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
