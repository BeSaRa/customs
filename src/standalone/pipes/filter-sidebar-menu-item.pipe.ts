import { inject, Pipe, PipeTransform } from '@angular/core';
import { MenuItemContract } from '@contracts/menu-item-contract';
import { LangService } from '@services/lang.service';

@Pipe({
  name: 'filterSidebarMenuItem',
  standalone: true,
})
export class FilterSidebarMenuItemPipe implements PipeTransform {
  lang = inject(LangService);

  transform(
    items: MenuItemContract[] | undefined,
    searchText: string
  ): MenuItemContract[] {
    return (items ?? []).filter((item) => {
      const text =
        this.lang.getCurrent().code === 'ar'
          ? item.arHiddenLabel
          : item.enHiddenLabel;
      return (text ?? '').includes(searchText);
    });
  }
}
