import { Component, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatIconModule } from '@angular/material/icon';
import { InputPrefixDirective } from '@standalone/directives/input-prefix.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { SidebarMenuComponent } from '@standalone/components/sidebar-menu/sidebar-menu.component';
import { MenuItemService } from '@services/menu-item.service';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

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
    ReactiveFormsModule,
  ],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  menuItemService = inject(MenuItemService);
  items = this.menuItemService.getMenu();
  control = new FormControl('', {
    nonNullable: true,
  });

  moveFocus() {
    const link = document.querySelector('.menu-item-link') as HTMLAnchorElement;
    link && link.focus();
  }
}
