import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar-menu',
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterLinkActive, RouterLink],
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarMenuComponent {
  @Input()
  items?: MenuItemContract[];
  @Input()
  level!: number;

  trackByLangKey(index: number, item: MenuItemContract) {
    return item.langKey;
  }
}
