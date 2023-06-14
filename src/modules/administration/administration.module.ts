import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatOptionModule, MatRippleModule } from '@angular/material/core';
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
import { InternalUserComponent } from '@modules/administration/components/internal-user/internal-user.component';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';
import { PenaltyComponent } from '@modules/administration/components/penalty/penalty.component';
import { TeamComponent } from '@modules/administration/components/team/team.component';
import { ViolationClassificationComponent } from '@modules/administration/components/violation-classification/violation-classification.component';
import { ViolationTypeComponent } from '@modules/administration/components/violation-type/violation-type.component';
import { InternalUserPopupComponent } from '@modules/administration/popups/internal-user-popup/internal-user-popup.component';
import { JobTitlePopupComponent } from '@modules/administration/popups/job-title-popup/job-title-popup.component';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { TeamPopupComponent } from '@modules/administration/popups/team-popup/team-popup.component';
import { ViolationClassificationPopupComponent } from '@modules/administration/popups/violation-classification-popup/violation-classification-popup.component';
import { ViolationTypePopupComponent } from '@modules/administration/popups/violation-type-popup/violation-type-popup.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';
import { FilterColumnComponent } from '@standalone/components/filter-column/filter-column.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { HighlightPipe } from '@standalone/directives/highlight.pipe';
import { OptionTemplateDirective } from '@standalone/directives/option-template.directive';
import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration.component';
import { UserPreferencesPopupComponent } from './popups/user-preferences-popup/user-preferences-popup.component';
import { LocalizationComponent } from './components/localization/localization.component';
import { LocalizationPopupComponent } from './popups/localization-popup/localization-popup.component';
import { PermissionRoleComponent } from '@modules/administration/components/permission-role/permission-role.component';
import { PermissionRolePopupComponent } from '@modules/administration/popups/permission-role-popup/permission-role-popup.component';
import { FilterArrayPipe } from '@standalone/pipes/filter-array.pipe';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { BrokerCompanyComponent } from '@modules/administration/components/broker-company/broker-company.component';
import { BrokerCompanyPopupComponent } from '@modules/administration/popups/broker-company-popup/broker-company-popup.component';
import { OrganizationUnitComponent } from '@modules/administration/components/organization-unit/organization-unit.component';
import { OrganizationUnitPopupComponent } from '@modules/administration/popups/organization-unit-popup/organization-unit-popup.component';
import { MawaredDepartmentComponent } from '@modules/administration/components/mawared-department/mawared-department.component';
import { MawaredDepartmentPopupComponent } from '@modules/administration/popups/mawared-department-popup/mawared-department-popup.component';
import { MawaredEmployeeComponent } from '@modules/administration/components/mawared-employee/mawared-employee.component';
import { MawaredEmployeePopupComponent } from '@modules/administration/popups/mawared-employee-popup/mawared-employee-popup.component';
import { BrokerComponent } from '@modules/administration/components/broker/broker.component';
import { BrokerPopupComponent } from '@modules/administration/popups/broker-popup/broker-popup.component';
import { StringToDatePipe } from '../../pipes/string-to-date.pipe';
import { ServicesComponent } from '@modules/administration/components/services/services.component';
import { ServicesPopupComponent } from '@modules/administration/popups/services-popup/services-popup.component';
import { ServiceStepsComponent } from '@modules/administration/components/service-steps/service-steps.component';
import { ServiceStepsPopupComponent } from '@modules/administration/popups/service-steps-popup/service-steps-popup.component';
import { EmailTemplateComponent } from '@modules/administration/components/email-template/email-template.component';
import { EmailTemplatePopupComponent } from '@modules/administration/popups/email-template-popup/email-template-popup.component';
import { HtmlEditorComponent } from '@standalone/components/html-editor/html-editor.component';
import { TxtToHtmlPipe } from '@standalone/pipes/txtToHtml.pipe';
import { GlobalSettingComponent } from '@modules/administration/components/global-setting/global-setting.component';

@NgModule({
  declarations: [
    AdministrationComponent,
    LocalizationPopupComponent,
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
    BrokerCompanyComponent,
    BrokerCompanyPopupComponent,
    OrganizationUnitComponent,
    OrganizationUnitPopupComponent,
    MawaredDepartmentComponent,
    MawaredDepartmentPopupComponent,
    MawaredEmployeeComponent,
    MawaredEmployeePopupComponent,
    BrokerComponent,
    BrokerPopupComponent,
    StringToDatePipe,
    ServicesComponent,
    ServicesPopupComponent,
    ServiceStepsComponent,
    ServiceStepsPopupComponent,
    EmailTemplateComponent,
    EmailTemplatePopupComponent,
    GlobalSettingComponent,
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
  ],
})
export class AdministrationModule {}
