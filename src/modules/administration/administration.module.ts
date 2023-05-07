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
import { TeamComponent } from '@modules/administration/components/team/team.component';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NameFilterComponent } from '@standalone/components/name-filter/name-filter.component';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';

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
    MatDialogModule,
    TextareaComponent,
    ReactiveFormsModule,
    MatSlideToggleModule,
    NameFilterComponent,
    HighlightPipe,
  ],
})
export class AdministrationModule {}
