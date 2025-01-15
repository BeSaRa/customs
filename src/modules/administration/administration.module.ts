import {
  CommonModule,
  NgComponentOutlet,
  NgOptimizedImage,
} from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AttachmentTypeComponent } from '@modules/administration/components/attachment-type/attachment-type.component';
import { ClearingAgencyComponent } from '@modules/administration/components/clearing-agency/clearing-agency.component';
import { ClearingAgentComponent } from '@modules/administration/components/clearing-agent/clearing-agent.component';
import { CustomMenuUrlHandlerComponent } from '@modules/administration/components/custom-menu-url-handler/custom-menu-url-handler.component';
import { CustomMenuComponent } from '@modules/administration/components/custom-menu/custom-menu.component';
import { EmailTemplateComponent } from '@modules/administration/components/email-template/email-template.component';
import { GlobalSettingComponent } from '@modules/administration/components/global-setting/global-setting.component';
import { InternalUserOUComponent } from '@modules/administration/components/internal-user-ou/internal-user-ou.component';
import { InternalUserComponent } from '@modules/administration/components/internal-user/internal-user.component';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';
import { LegalRuleComponent } from '@modules/administration/components/legal-rule/legal-rule.component';
import { ManagerDelegationComponent } from '@modules/administration/components/manager-delegation/manager-delegation.component';
import { MawaredDepartmentComponent } from '@modules/administration/components/mawared-department/mawared-department.component';
import { MawaredEmployeeComponent } from '@modules/administration/components/mawared-employee/mawared-employee.component';
import { OrganizationUnitComponent } from '@modules/administration/components/organization-unit/organization-unit.component';
import { PenaltyDetailsComponent } from '@modules/administration/components/penalty-details/penalty-details.component';
import { PenaltyComponent } from '@modules/administration/components/penalty/penalty.component';
import { PermissionRoleComponent } from '@modules/administration/components/permission-role/permission-role.component';
import { ServiceStepsComponent } from '@modules/administration/components/service-steps/service-steps.component';
import { ServicesComponent } from '@modules/administration/components/services/services.component';
import { SuspendedEmployeeComponent } from '@modules/administration/components/suspended-employee/suspended-employee.component';
import { TeamComponent } from '@modules/administration/components/team/team.component';
import { UserCustomMenusComponent } from '@modules/administration/components/user-custom-menus/user-custom-menus.component';
import { UserDelegationComponent } from '@modules/administration/components/user-delegation/user-delegation.component';
import { ViolationClassificationComponent } from '@modules/administration/components/violation-classification/violation-classification.component';
import { ViolationPenaltyComponent } from '@modules/administration/components/violation-penalty/violation-penalty.component';
import { ViolationTypeComponent } from '@modules/administration/components/violation-type/violation-type.component';
import { AttachmentTypePopupComponent } from '@modules/administration/popups/attachment-type-popup/attachment-type-popup.component';
import { ClearingAgencyPopupComponent } from '@modules/administration/popups/clearing-agency-popup/clearing-agency-popup.component';
import { ClearingAgentPopupComponent } from '@modules/administration/popups/clearing-agent-popup/clearing-agent-popup.component';
import { CustomMenuPopupComponent } from '@modules/administration/popups/custom-menu-popup/custom-menu-popup.component';
import { EmailTemplatePopupComponent } from '@modules/administration/popups/email-template-popup/email-template-popup.component';
import { InternalUserOUPopupComponent } from '@modules/administration/popups/internal-user-ou-popup/internal-user-ou-popup.component';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { LegalRulePopupComponent } from '@modules/administration/popups/legal-rule-popup/legal-rule-popup.component';
import { ManagerDelegationPopupComponent } from '@modules/administration/popups/manager-delegation-popup/manager-delegation-popup.component';
import { MawaredDepartmentPopupComponent } from '@modules/administration/popups/mawared-department-popup/mawared-department-popup.component';
import { MawaredEmployeePopupComponent } from '@modules/administration/popups/mawared-employee-popup/mawared-employee-popup.component';
import { OrganizationUnitPopupComponent } from '@modules/administration/popups/organization-unit-popup/organization-unit-popup.component';
import { PenaltyDetailsPopupComponent } from '@modules/administration/popups/penalty-details-popup/penalty-details-popup.component';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { PermissionRolePopupComponent } from '@modules/administration/popups/permission-role-popup/permission-role-popup.component';
import { ServiceStepsPopupComponent } from '@modules/administration/popups/service-steps-popup/service-steps-popup.component';
import { ServicesPopupComponent } from '@modules/administration/popups/services-popup/services-popup.component';
import { SuspendedEmployeePopupComponent } from '@modules/administration/popups/suspended-employee-popup/suspended-employee-popup.component';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { UserDelegationPopupComponent } from '@modules/administration/popups/user-delegation-popup/user-delegation-popup.component';
import { UserTeamPopupComponent } from '@modules/administration/popups/user-team-popup/user-team-popup.component';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { ViolationPenaltyPopupComponent } from '@modules/administration/popups/violation-penalty-popup/violation-penalty-popup.component';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { HtmlEditorComponent } from '@standalone/components/html-editor/html-editor.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { ManagerDelegationManagementComponent } from '@standalone/components/manager-delegation-management/manager-delegation-management.component';
import { MenuItemListComponent } from '@standalone/components/menu-item-list/menu-item-list.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { FilterArrayPipe } from '@standalone/pipes/filter-array.pipe';
import { TxtToHtmlPipe } from '@standalone/pipes/txtToHtml.pipe';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { LocalizationComponent } from './components/localization/localization.component';
import { UserPreferencesPopupComponent } from './popups/user-preferences-popup/user-preferences-popup.component';
import { AiSearchComponent } from './components/ai-search/ai-search.component';
import { RecorderComponent } from '@modules/administration/components/recorder/recorder.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationComponent,
    InternalUserComponent,
    InternalUserPopupComponent,
    UserPreferencesPopupComponent,
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
    PermissionRoleComponent,
    PermissionRolePopupComponent,
    OrganizationUnitComponent,
    OrganizationUnitPopupComponent,
    MawaredDepartmentComponent,
    MawaredDepartmentPopupComponent,
    MawaredEmployeeComponent,
    MawaredEmployeePopupComponent,
    ServicesComponent,
    ServicesPopupComponent,
    ServiceStepsComponent,
    ServiceStepsPopupComponent,
    EmailTemplateComponent,
    EmailTemplatePopupComponent,
    GlobalSettingComponent,
    ViolationPenaltyComponent,
    ViolationPenaltyPopupComponent,
    LegalRuleComponent,
    LegalRulePopupComponent,
    PenaltyDetailsComponent,
    PenaltyDetailsPopupComponent,
    AttachmentTypeComponent,
    AttachmentTypePopupComponent,
    InternalUserOUComponent,
    InternalUserOUPopupComponent,
    UserTeamPopupComponent,
    ClearingAgentComponent,
    ClearingAgentPopupComponent,
    ClearingAgencyComponent,
    ClearingAgencyPopupComponent,
    SuspendedEmployeeComponent,
    SuspendedEmployeePopupComponent,
    ManagerDelegationComponent,
    ManagerDelegationPopupComponent,
    CustomMenuComponent,
    CustomMenuPopupComponent,
    UserDelegationComponent,
    UserDelegationPopupComponent,
    AiSearchComponent,
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
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSlideToggleModule,
    ContextMenuComponent,
    MatMenuModule,
    MatSelectModule,
    MatOptionModule,
    MatTabsModule,
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
    FilterArrayPipe,
    InputSuffixDirective,
    MatRippleModule,
    TxtToHtmlPipe,
    HtmlEditorComponent,
    MenuItemListComponent,
    NgOptimizedImage,
    ControlDirective,
    MatDatepicker,
    MatDatepickerInput,
    ManagerDelegationManagementComponent,
    CustomMenuUrlHandlerComponent,
    UserCustomMenusComponent,
    NgComponentOutlet,
    RecorderComponent,
  ],
})
export class AdministrationModule {}
