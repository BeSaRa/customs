import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TeamComponent } from '@modules/administration/components/team/team.component';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { LocalizationComponent } from './components/localization/localization.component';
import { LocalizationPopupComponent } from './popups/localization-popup/localization-popup.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationPopupComponent,
    LocalizationComponent,
    TeamComponent,
    TeamPopupComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    MatTableModule,
    MatPaginatorModule,
    ButtonComponent,
    MatIconModule,
    MatButtonModule,
    IconButtonComponent,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    InputComponent,
    SwitchComponent,
    MatDialogModule,
    TextareaComponent,
    ReactiveFormsModule,
    ContextMenuComponent,
    MatMenuModule,
    MatSlideToggleModule,
    FilterColumnComponent,
    SelectInputComponent,
    MatOptionModule,
    OptionTemplateDirective,
    HighlightPipe,
  ],
})
export class AdministrationModule {}
