import { MatMenuModule } from '@angular/material/menu';
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
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { ControlDirective } from '@standalone/directives/control.directive';
import { CaseAttachmentsComponent } from '@standalone/components/case-attachments/case-attachments.component';
import { ViolationListComponent } from '@standalone/components/violation-list/violation-list.component';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { WitnessesListComponent } from '@standalone/components/witnesses-list/witnesses-list.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { InvestigationSearchComponent } from './components/investigation-search/investigation-search.component';
import { TeamInboxComponent } from './components/team-inbox/team-inbox.component';
import { SituationSearchComponent } from './components/situation-search/situation-search.component';
import { InvestigationDraftsComponent } from './components/investigation-drafts/investigation-drafts.component';

@NgModule({
  declarations: [
    ElectronicServicesComponent,
    InvestigationComponent,
    UserInboxComponent,
    GuidePanelComponent,
    TeamInboxComponent,
    InvestigationSearchComponent,
    SituationSearchComponent,
    InvestigationDraftsComponent,
  ],
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
    MatMenuModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonToggleModule,
    FilterColumnComponent,
    ContextMenuComponent,
    MatCardModule,
    MatSlideToggleModule,
    ButtonComponent,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatInputModule,
    ControlDirective,
    CaseAttachmentsComponent,
    ViolationListComponent,
    OffenderListComponent,
    WitnessesListComponent,
  ],
})
export class ElectronicServicesModule {}
