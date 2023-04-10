import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { InputPrefixDirective } from '@standalone/directives/input-prefix.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { SidebarMenuComponent } from '@standalone/components/sidebar-menu/sidebar-menu.component';
import { MenuItemService } from '@services/menu-item.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    MatIconModule,
    InputPrefixDirective,
    InputSuffixDirective,
    NgOptimizedImage,
    SidebarMenuComponent,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  menuItemService = inject(MenuItemService);
  items = this.menuItemService.getMenu();
}
