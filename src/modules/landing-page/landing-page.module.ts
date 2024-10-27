import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, Routes } from '@angular/router';
import { AppPermissionsGroup } from '@constants/app-permissions-group';
import { accessPageGuard } from '@guards/access-page-guard';
import { LandingPageComponent } from '@modules/landing-page/components/landing-page/landing-page.component';
import { layoutWidgetResolver } from '@resolvers/layout-widget.resolver';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { GridstackModule } from 'gridstack/dist/angular';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { CountUpModule } from 'ngx-countup';
import { BarChartWidgetComponent } from './components/bar-chart-widget/bar-chart-widget.component';
import { CounterWidgetComponent } from './components/counter-widget/counter-widget.component';
import { LayoutComponent } from './components/layout/layout.component';
import { NewWidgetComponent } from './components/new-widget/new-widget.component';
import { PieChartWidgetComponent } from './components/pie-chart-widget/pie-chart-widget.component';
import { WidgetContainerComponent } from './components/widget-container/widget-container.component';
import { WidgetOptionsMenuComponent } from './components/widget-options-menu/widget-options-menu.component';
import { WidgetsSidebarComponent } from './components/widgets-sidebar/widgets-sidebar.component';
import { LayoutPopupComponent } from './popupss/layout-popup/layout-popup.component';

const routes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    resolve: { info: layoutWidgetResolver },
    canActivate: [
      accessPageGuard(
        {
          permissionGroup: AppPermissionsGroup.DASHBOARD,
        },
        true,
      ),
    ],
  },
];

@NgModule({
  declarations: [
    LandingPageComponent,
    NewWidgetComponent,
    BarChartWidgetComponent,
    PieChartWidgetComponent,
    CounterWidgetComponent,
    WidgetContainerComponent,
    LayoutComponent,
    WidgetsSidebarComponent,
    LayoutPopupComponent,
    WidgetOptionsMenuComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GridstackModule,
    InputComponent,
    BaseChartDirective,
    ButtonComponent,
    IconButtonComponent,
    SelectInputComponent,
    ReactiveFormsModule,
    MatTooltipModule,
    CountUpModule,
    MatDialogModule,
    MatMenuModule,
    MatListModule,
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class LandingPageModule {}
