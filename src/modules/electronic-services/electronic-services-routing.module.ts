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

const routes: Routes = [
  { path: '', component: ElectronicServicesComponent },
  {
    path: 'investigation',
    component: InvestigationComponent,
    resolve: { info: itemResolver },
    canDeactivate: [investigationCanDeactivateGuard],
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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicServicesRoutingModule {}
