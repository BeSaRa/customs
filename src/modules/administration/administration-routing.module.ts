import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { AppRoutes } from '@constants/app-routes';
import { LocalizationComponent } from '@modules/administration/components/localization/localization.component';
import { PenaltyComponent } from '@modules/administration/components/penalty/penalty.component';

const routes: Routes = [
  { path: '', component: AdministrationComponent },
  {
    path: AppRoutes.LOCALIZATION,
    component: LocalizationComponent,
  },
  {
    path: AppRoutes.PENALTY,
    component: PenaltyComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
