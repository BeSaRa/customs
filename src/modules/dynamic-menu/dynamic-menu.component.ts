import { Component, effect, inject, input } from '@angular/core';
import { MenuIdes } from '@constants/menu-ides';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { MenuItemService } from '@services/menu-item.service';

@Component({
  selector: 'app-dynamic-menu',
  templateUrl: './dynamic-menu.component.html',
  styleUrl: './dynamic-menu.component.scss',
})
export class DynamicMenuComponent {
  protected readonly MenuIdes = MenuIdes;
  private menuItemService = inject(MenuItemService);
  items: MenuItemContract[] = [];
  parentId = input<string>();

  parentEffect = effect(() => {
    if (this.parentId()) {
      this.items = this.menuItemService.getChildren(this.parentId()!);
    }
  });
}
