import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DynamicMenuComponent } from './dynamic-menu.component';
import { DynamicMenuDetailsComponent } from '@modules/dynamic-menu/components/dynamic-menu-details/dynamic-menu-details.component';

const routes: Routes = [
  { path: ':parentId', component: DynamicMenuComponent },
  { path: ':parentId/details', component: DynamicMenuDetailsComponent },
  {
    path: ':parentId/details/:childId',
    component: DynamicMenuDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DynamicMenuRoutingModule {}
