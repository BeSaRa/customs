import { inject, Injectable } from '@angular/core';
import { MenuIdes } from '@constants/menu-ides';
import { Menus } from '@constants/menus';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { EmployeeService } from '@services/employee.service';
import { LangService } from '@services/lang.service';
import { AppPermissionsGroup } from '@constants/app-permissions-group';
import { AppPermissionsType } from '@constants/app-permissions';
import { TeamNames } from '@enums/team-names';
import { CustomMenu } from '@models/custom-menu';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private readonly staticMenus = Menus;
  private filteredStaticMenu: MenuItemContract[] = [];
  parents: MenuItemContract[] = [];
  private children: Record<number | string, MenuItemContract[]> = {};
  private readonly employeeService = inject(EmployeeService);
  private readonly lang = inject(LangService);

  constructor() {
    this.listenToChangeLanguage();
  }

  clearMenu(): void {
    this.parents = [];
    this.children = {};
  }

  getMenu(): MenuItemContract[] {
    return this.parents;
  }

  getChildren(parentId: number | string): MenuItemContract[] {
    return this.children[parentId] || [];
  }

  filterStaticMenu(dynamicMenus: CustomMenu[]): void {
    dynamicMenus.sort((a, b) => a.menuOrder - b.menuOrder);
    dynamicMenus.forEach(menu => {
      menu.subMenuItems.sort((a, b) => a.menuOrder - b.menuOrder);
    });
    this.filteredStaticMenu = this.staticMenus
      .concat(dynamicMenus.map(item => item.convertToMenuItem()))
      .filter(item => {
        return (
          (!item.permission &&
            !item.permissionGroup &&
            !item.permissionFromTeam) ||
          (item.permission &&
            this.employeeService.hasPermissionTo(item.permission)) ||
          (item.permissionFromTeam &&
            this.employeeService.hasPermissionFromTeam(
              <TeamNames>item.permissionFromTeam,
            )) ||
          (item.permissionGroup &&
            this.employeeService.hasAnyPermissions(
              AppPermissionsGroup[
                item.permissionGroup
              ] as unknown as (keyof AppPermissionsType)[],
            ))
        );
      });
  }

  buildHierarchy() {
    this.clearMenu();
    this.filteredStaticMenu.forEach(item => {
      if (!item.parent) {
        this.parents.push(item);
        return;
      }

      if (!Object.prototype.hasOwnProperty.call(this.children, item.parent)) {
        this.children[item.parent] = [];
      }

      this.children[item.parent].push(item);
    });

    this.parents.forEach(item => {
      item.children = this.getItemChildren(item);
      const arabic: string[] = [];
      const english: string[] = [];
      this.getSearchText(item, '', '', arabic, english);
      item.englishSearchText = english.join('󰜈');
      item.arabicSearchText = arabic.join('󰜈');
    });

    this.translateMenuItems();

    this.parents.sort((a, b) => {
      return (a.order ?? 0) - (b.order ?? 0);
    });
  }

  private getItemChildren(item: MenuItemContract) {
    return (this.children[item.id] ?? []).map(item => {
      item.children = this.getItemChildren(item);
      return item;
    });
  }

  private getSearchText(
    item: MenuItemContract,
    arabicSearchText: string,
    englishSearchText: string,
    arabicChildren: string[],
    englishChildren: string[],
  ) {
    const { arName, enName } =
      typeof item.id === 'number'
        ? this.lang.getLocalizationByKey(item.langKey)
        : { arName: item.arName!, enName: item.enName! };
    item.arName = arName;
    item.enName = enName;
    arabicChildren.push(arName);
    englishChildren.push(enName);
    item.arabicSearchText = arabicSearchText + '󰜈' + arName;
    item.englishSearchText = englishSearchText + '󰜈' + enName;
    (item.children ?? []).forEach(child => {
      this.getSearchText(
        child,
        item.arabicSearchText || '',
        item.englishSearchText || '',
        arabicChildren,
        englishChildren,
      );
    });
  }

  private translateMenu(item: MenuItemContract): void {
    const isArabic = () => {
      return this.lang.getCurrent().code === 'ar';
    };
    item.translate = isArabic() ? item.arName : item.enName;
    item.searchText = isArabic()
      ? item.arabicSearchText
      : item.englishSearchText;

    item.children?.forEach(item => {
      this.translateMenu(item);
    });
  }

  private translateMenuItems(): void {
    this.parents.forEach(item => {
      this.translateMenu(item);
    });
  }

  private listenToChangeLanguage() {
    this.lang.change$.subscribe(() => {
      this.translateMenuItems();
    });
  }

  getMenuItemByLangKey(
    langKey: keyof LangKeysContract,
  ): MenuItemContract | undefined {
    return this.getChildren(MenuIdes.ELECTRONIC_SERVICES).find(
      item => item.langKey === langKey,
    );
  }
}
