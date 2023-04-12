import { Pipe, PipeTransform } from '@angular/core';
import { MenuItemContract } from '@contracts/menu-item-contract';

@Pipe({
  name: 'filterSidebarMenuItem',
  standalone: true,
})
export class FilterSidebarMenuItemPipe implements PipeTransform {
  transform(
    items: MenuItemContract[] | undefined,
    searchText: string
  ): MenuItemContract[] {
    return (items ?? []).filter((item) => {
      return (item.searchText ?? '')
        .toLowerCase()
        .includes(searchText.toLowerCase());
    });
  }
}
