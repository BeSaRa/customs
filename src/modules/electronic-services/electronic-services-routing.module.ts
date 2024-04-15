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
import { LDAPGroupNames } from '@enums/department-group-names.enum';

const routes: Routes = [
  { path: '', component: ElectronicServicesComponent },
  {
    path: 'investigation',
    component: InvestigationComponent,
    resolve: { info: itemResolver },
    canDeactivate: [investigationCanDeactivateGuard],
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
  },
  {
    path: AppRoutes.CALENDAR,
    component: CalendarComponent,
    canActivate: [
      accessPageGuard({
        permissionFromTeam: LDAPGroupNames.Disciplinary_Committee,
      }),
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicServicesRoutingModule {}
