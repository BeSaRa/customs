import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DynamicMenuRoutingModule } from './dynamic-menu-routing.module';
import { DynamicMenuComponent } from './dynamic-menu.component';
import { MenuItemListComponent } from '@standalone/components/menu-item-list/menu-item-list.component';

@NgModule({
  declarations: [DynamicMenuComponent],
  imports: [CommonModule, DynamicMenuRoutingModule, MenuItemListComponent],
})
export class DynamicMenuModule {}
