import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ElectronicServicesComponent } from './electronic-services.component';
import { InvestigationComponent } from '@modules/electronic-services/components/investigation/investigation.component';
import { AppRoutes } from '@constants/app-routes';
import { UserInboxComponent } from './components/user-inbox/user-inbox.component';
import { GuidePanelComponent } from './components/guide-panel/guide-panel.component';
import { ServiceItemResolver } from '@resolvers/service-item.resolver';

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
    path: AppRoutes.GUIDE_PANEL,
    component: GuidePanelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ElectronicServicesRoutingModule { }
