import { inject, Injectable } from '@angular/core';
import { Menus } from '@constants/menus';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { EmployeeService } from '@services/employee.service';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private readonly staticMenus = Menus;
  private filteredStaticMenu: MenuItemContract[] = [];
  private parents: MenuItemContract[] = [];
  private children: Record<number, MenuItemContract[]> = {};
  private readonly employeeService = inject(EmployeeService);

  clearMenu(): void {
    this.parents = [];
  }

  getMenu(): MenuItemContract[] {
    return this.parents;
  }

  filterStaticMenu(): void {
    this.filteredStaticMenu = this.staticMenus.filter((item) => {
      return (
        !item.permission ||
        (item.permission &&
          this.employeeService.hasPermissionTo(item.permission))
      );
    });
  }

  buildHierarchy() {
    this.filteredStaticMenu.forEach((item) => {
      if (!item.parent) {
        this.parents.push(item);
        return;
      }

      if (!Object.prototype.hasOwnProperty.call(this.children, item.parent)) {
        this.children[item.parent] = [];
      }

      this.children[item.parent].push(item);
    });

    this.parents.map((item) => {
      item.children = this.getItemChildren(item);
      return item;
    });

    this.parents.sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }

  private getItemChildren(item: MenuItemContract) {
    return (this.children[item.id] ?? []).map((item) => {
      item.children = this.getItemChildren(item);
      return item;
    });
  }
}
