import { WidgetState } from '@abstracts/widget-state';
import { Component } from '@angular/core';
import { BaseWidgetDirective } from '@modules/landing-page/directives/base-widget.directive';
import { ChartDataset, ChartTypeRegistry, CoreChartOptions } from 'chart.js';

export class BarChartWidgetState extends WidgetState {}

@Component({
  selector: 'app-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrl: './bar-chart-widget.component.scss',
})
export class BarChartWidgetComponent extends BaseWidgetDirective {
  public SystemName: string = 'MF1';

  public lineChartData: Array<number> = [1, 8, 49];

  public labelMFL: ChartDataset[] = [
    { data: this.lineChartData, label: this.SystemName },
  ];
  // labels
  public lineChartLabels: Array<unknown> = [
    '2018-01-29 10:00:00',
    '2018-01-29 10:27:00',
    '2018-01-29 10:28:00',
  ];

  public lineChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          ticks: {
            max: 60,
            min: 0,
          },
        },
      ],
      xAxes: [{}],
    },
    plugins: {
      datalabels: {
        display: true,
        align: 'top',
        anchor: 'end',
        //color: "#2756B3",
        color: '#222',

        font: {
          family: 'FontAwesome',
          size: 14,
        },
      },
      deferred: false,
    },
  } as unknown as CoreChartOptions<keyof ChartTypeRegistry>;

  _lineChartColors: Array<unknown> = [
    {
      backgroundColor: 'red',
      borderColor: 'red',
      pointBackgroundColor: 'red',
      pointBorderColor: 'red',
      pointHoverBackgroundColor: 'red',
      pointHoverBorderColor: 'red',
    },
  ];

  public ChartType = 'bar' as keyof ChartTypeRegistry;

  override isMulti() {
    return true;
  }
}
