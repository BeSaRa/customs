import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from '@modules/landing-page/components/landing-page/landing-page.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { GridstackModule } from 'gridstack/dist/angular';
import { BarChartWidgetComponent } from './components/bar-chart-widget/bar-chart-widget.component';
import { CounterWidgetComponent } from './components/counter-widget/counter-widget.component';
import { NewWidgetComponent } from './components/new-widget/new-widget.component';
import { PieChartWidgetComponent } from './components/pie-chart-widget/pie-chart-widget.component';
import { WidgetContainerComponent } from './components/widget-container/widget-container.component';
import {
  BaseChartDirective,
  provideCharts,
  withDefaultRegisterables,
} from 'ng2-charts';
import { LayoutComponent } from './components/layout/layout.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WidgetsSidebarComponent } from './components/widgets-sidebar/widgets-sidebar.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CountUpModule } from 'ngx-countup';

const routes: Routes = [{ path: '', component: LandingPageComponent }];

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
  ],
  providers: [provideCharts(withDefaultRegisterables())],
})
export class LandingPageModule {}
