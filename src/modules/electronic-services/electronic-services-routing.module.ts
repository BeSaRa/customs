import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectronicServicesComponent } from './electronic-services.component';
import { InvestigationComponent } from '@modules/electronic-services/components/investigation/investigation.component';
import { AppRoutes } from '@constants/app-routes';
import { UserInboxComponent } from './components/user-inbox/user-inbox.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { ServiceItemResolver } from '@resolvers/service-item.resolver';
import { InvestigationSearchComponent } from './components/investigation-search/investigation-search.component';
import { TeamInboxComponent } from './components/team-inbox/team-inbox.component';
import { InvestigationDraftsComponent } from './components/investigation-drafts/investigation-drafts.component';

const routes: Routes = [
  { path: '', component: ElectronicServicesComponent },
  {
    path: 'investigation',
    component: InvestigationComponent,
    resolve: { info: ServiceItemResolver.resolve },
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
  },
  {
    path: AppRoutes.INVESTIGATION_SEARCH,
    component: InvestigationSearchComponent,
  },
  {
    path: AppRoutes.INVESTIGATION_DRAFTS,
    component: InvestigationDraftsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicServicesRoutingModule {}
