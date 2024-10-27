import { WidgetState } from '@abstracts/widget-state';
import { Component } from '@angular/core';
import { BaseWidgetDirective } from '@modules/landing-page/directives/base-widget.directive';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

export class PieChartWidgetState extends WidgetState {}

@Component({
  selector: 'app-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrl: './pie-chart-widget.component.scss',
})
export class PieChartWidgetComponent extends BaseWidgetDirective {
  public pieChartOptions: ChartConfiguration['options'] = {
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Download', 'Sales'], ['In', 'Store', 'Sales'], 'Mail Sales'],
    datasets: [
      {
        data: [300, 500, 100],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';

  override isMulti() {
    return true;
  }
}
