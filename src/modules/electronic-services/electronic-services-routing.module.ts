import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectronicServicesComponent } from './electronic-services.component';
import { InvestigationComponent } from '@modules/electronic-services/components/investigation/investigation.component';
import { AppRoutes } from '@constants/app-routes';
import { UserInboxComponent } from './components/user-inbox/user-inbox.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { InvestigationSearchComponent } from './components/investigation-search/investigation-search.component';
import { TeamInboxComponent } from './components/team-inbox/team-inbox.component';
import { InvestigationDraftsComponent } from './components/investigation-drafts/investigation-drafts.component';
import { itemResolver } from '@resolvers/item.resolver';
import { investigationCanDeactivateGuard } from '@guards/investigation-can-deactivate.guard';
import { accessPageGuard } from '@guards/access-page-guard';
import { AppPermissions } from '@constants/app-permissions';
import { CalendarComponent } from '@modules/electronic-services/components/calendar/calendar.component';
import { TeamNames } from '@enums/team-names';
import { GrievanceComponent } from '@modules/electronic-services/components/grievance/grievance.component';
import { ArchivistGrievanceComponent } from '@modules/electronic-services/components/archivist-grievance/archivist-grievance.component';
import { FinesComponent } from '@modules/electronic-services/components/fines/fines.component';
import { CourtDecisionsComponent } from './components/court-decisions/court-decisions.component';
import { CustomInvestigationRouteReuseStrategy } from '@models/custom-investigation-route-reuse-strategy';
import { PenaltyModificationComponent } from '@modules/electronic-services/components/penalty-modification/penalty-modification.component';
import { EmployeesInboxManagementComponent } from '@modules/electronic-services/components/employees-inbox-managament/employees-inbox-management.component';

const routes: Routes = [
  { path: '', component: ElectronicServicesComponent },
  {
    path: 'investigation',
    component: InvestigationComponent,
    resolve: { info: itemResolver },
    canDeactivate: [investigationCanDeactivateGuard],
    runGuardsAndResolvers: CustomInvestigationRouteReuseStrategy.shouldReload,
  },
  {
    path: 'grievance',
    component: GrievanceComponent,
    resolve: { info: itemResolver },
  },
  {
    path: AppRoutes.USER_INBOX,
    component: UserInboxComponent,
  },
  {
    path: AppRoutes.TEAM_INBOX,
    component: TeamInboxComponent,
  },
  {
    path: AppRoutes.PENALTY_MODIFICATION,
    component: PenaltyModificationComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.CREATE_PENALTY_MODIFICATION_REQUEST,
      }),
    ],
  },
  {
    path: AppRoutes.EMPLOYEES_INBOX_MANAGEMENT,
    component: EmployeesInboxManagementComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.INBOX_FOLLOW_UP,
      }),
    ],
  },
  {
    path: AppRoutes.GUIDE_PANEL,
    component: GuidePanelComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.GUIDE_PANEL,
      }),
    ],
  },
  {
    path: AppRoutes.INVESTIGATION_SEARCH,
    component: InvestigationSearchComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.SEARCH_FOR_REPORTS,
      }),
    ],
  },
  {
    path: AppRoutes.INVESTIGATION_DRAFTS,
    component: InvestigationDraftsComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.SEARCH_FOR_DRAFTS,
      }),
    ],
  },
  {
    path: AppRoutes.CALENDAR,
    component: CalendarComponent,
    canActivate: [
      accessPageGuard({
        permissionFromTeam: TeamNames.Disciplinary_Committee,
      }),
    ],
  },
  {
    path: AppRoutes.GRIEVANCE,
    component: ArchivistGrievanceComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.GRIEVANCE_ARCHIVE,
      }),
    ],
  },
  {
    path: AppRoutes.FINES,
    component: FinesComponent,
    canActivate: [
      accessPageGuard({
        permission: AppPermissions.OFFLINE_PAYMENT,
      }),
    ],
  },
  {
    path: AppRoutes.COURT_DECISIONS,
    component: CourtDecisionsComponent,
    // canActivate: [
    //   accessPageGuard({
    //     permission: AppPermissions.OFFLINE_PAYMENT,
    //   }),
    // ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicServicesRoutingModule {}
