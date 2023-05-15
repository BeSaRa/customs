import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { LocalizationPopupComponent } from './popups/localization-popup/localization-popup.component';
import { LocalizationComponent } from './components/localization/localization.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDialogModule } from '@angular/material/dialog';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ReactiveFormsModule } from '@angular/forms';
import { InternalUserComponent } from '@modules/administration/components/internal-user/internal-user.component';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { MatMenuModule } from '@angular/material/menu';
import { UserPreferencesPopupComponent } from './popups/user-preferences-popup/user-preferences-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTabsModule } from '@angular/material/tabs';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SwitchComponent } from '@standalone/components/switch/switch.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationPopupComponent,
    LocalizationComponent,
    InternalUserComponent,
    InternalUserPopupComponent,
    UserPreferencesPopupComponent,
    JobTitleComponent,
    JobTitlePopupComponent,
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
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
    FilterColumnComponent,
    SelectInputComponent,
    MatOptionModule,
    OptionTemplateDirective,
    HighlightPipe,
    MatSelectModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule,
    MatCardModule,
    SwitchComponent,
  ],
})
export class AdministrationModule {}
