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
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { UserInboxComponent } from './components/user-inbox/user-inbox.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
@NgModule({
  declarations: [ElectronicServicesComponent, InvestigationComponent, UserInboxComponent],
  imports: [
    CommonModule,
    ElectronicServicesRoutingModule,
    MenuItemListComponent,
    IconButtonComponent,
    MatTooltipModule,
    MatTabsModule,
    MatIconModule,
    InputComponent,
    SelectInputComponent,
    TextareaComponent,
    MatExpansionModule,

    MatProgressSpinnerModule,
    MatTableModule,
    FilterColumnComponent,
    ContextMenuComponent,
  ],
})
export class ElectronicServicesModule {}
