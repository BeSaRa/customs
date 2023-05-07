import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministrationComponent } from './administration.component';
import { AppRoutes } from '@constants/app-routes';
import { LocalizationComponent } from '@modules/administration/components/localization/localization.component';
import { JobTitleComponent } from '@modules/administration/components/job-title/job-title.component';

const routes: Routes = [
  { path: '', component: AdministrationComponent },
  {
    path: AppRoutes.LOCALIZATION,
    component: LocalizationComponent,
  },
  {
    path: AppRoutes.JOB_TITLE,
    component: JobTitleComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdministrationRoutingModule {}
