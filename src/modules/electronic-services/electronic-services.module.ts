import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ElectronicServicesRoutingModule } from './electronic-services-routing.module';
import { ElectronicServicesComponent } from './electronic-services.component';
import { MenuItemListComponent } from '@standalone/components/menu-item-list/menu-item-list.component';
import { InvestigationComponent } from './components/investigation/investigation.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [ElectronicServicesComponent, InvestigationComponent],
  imports: [
    CommonModule,
    ElectronicServicesRoutingModule,
    MenuItemListComponent,
    IconButtonComponent,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
  ],
})
export class ElectronicServicesModule {}
