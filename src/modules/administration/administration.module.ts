import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule } from '@angular/material/core';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';
import { TeamComponent } from '@modules/administration/components/team/team.component';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { PenaltyComponent } from '@modules/administration/components/penalty/penalty.component';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ViolationClassificationComponent } from '@modules/administration/components/violation-classification/violation-classification.component';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { ViolationTypeComponent } from '@modules/administration/components/violation-type/violation-type.component';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { SwitchComponent } from '@standalone/components/switch/switch.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationPopupComponent,
    LocalizationComponent,
    PenaltyComponent,
    PenaltyPopupComponent,
    ViolationClassificationComponent,
    ViolationClassificationPopupComponent,
    ViolationTypeComponent,
    ViolationTypePopupComponent,
    TeamComponent,
    TeamPopupComponent,
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
    MatSlideToggleModule,
    MatSelectModule,
    MatButtonModule,
    MatInputModule,
    IconButtonComponent,
    MatTooltipModule,
    MatSortModule,
    MatCheckboxModule,
    InputComponent,
    SwitchComponent,
    MatDialogModule,
    TextareaComponent,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ContextMenuComponent,
    MatMenuModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
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
    MatProgressBarModule,
  ],
})
export class AdministrationModule {}
