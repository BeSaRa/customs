import { Pipe, PipeTransform } from '@angular/core';
import { MenuItemContract } from '@contracts/menu-item-contract';

@Pipe({
  name: 'filterSidebarMenuItem',
  standalone: true,
})
export class FilterSidebarMenuItemPipe implements PipeTransform {
  transform(
    items: MenuItemContract[] | undefined,
    searchText: string | null | undefined,
    onlyTranslation = false,
  ): MenuItemContract[] {
    if (!searchText) {
      return items ?? [];
    }
    return (items ?? []).filter(item => {
      return ((onlyTranslation ? item.translate : item.searchText) ?? '')
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  }
}
