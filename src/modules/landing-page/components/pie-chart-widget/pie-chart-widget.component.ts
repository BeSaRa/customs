import { WidgetState } from '@abstracts/widget-state';
import { AfterViewInit, Component } from '@angular/core';
import { BaseChartWidgetDirective } from '@modules/landing-page/directives/base-chart-widget.directive';
import {
  Chart,
  ChartTypeRegistry,
  CoreChartOptions,
  ScriptableContext,
} from 'chart.js/auto';

export class PieChartWidgetState extends WidgetState {}

@Component({
  selector: 'app-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrl: './pie-chart-widget.component.scss',
})
export class PieChartWidgetComponent
  extends BaseChartWidgetDirective
  implements AfterViewInit
{
  override _initializeChart() {
    this.chart = new Chart(this._canvas.nativeElement, {
      type: 'pie',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: (context: ScriptableContext<any>) =>
              this._getColor(context.dataIndex),
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              title: this._getCustomTooltipTitle,
              label: this._getCustomTooltipLabel,
            },
          },
        },
      } as unknown as CoreChartOptions<keyof ChartTypeRegistry>,
    });
  }
}
