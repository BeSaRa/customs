import { WidgetState } from '@abstracts/widget-state';
import { AfterViewInit, Component, computed } from '@angular/core';
import { AdminResult } from '@models/admin-result';
import { BaseChartWidgetDirective } from '@modules/landing-page/directives/base-chart-widget.directive';
import {
  Chart,
  ChartTypeRegistry,
  CoreChartOptions,
  ScriptableContext,
} from 'chart.js/auto';

export class BarChartWidgetState extends WidgetState {}

@Component({
  selector: 'app-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrl: './bar-chart-widget.component.scss',
})
export class BarChartWidgetComponent
  extends BaseChartWidgetDirective
  implements AfterViewInit
{
  private _teamsColorsIndices = computed(() => {
    let _index = 0;
    return this._chartWidgetCounters().reduce(
      (acc, cur) => {
        if (!acc[cur.teamId]) {
          acc[cur.teamId] = [_index, cur.teamInfo];
          _index += 1;
        }
        return acc;
      },
      {} as Record<number, [number, AdminResult]>,
    );
  });

  override _initializeChart() {
    this.chart = new Chart(this._canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: '',
            backgroundColor: (context: ScriptableContext<any>) =>
              this._getColor(
                this._teamsColorsIndices()[
                  this._getCounterAtIndex(context.dataIndex)?.teamId ?? 0
                ]?.[0] ?? 0,
              ),
          },
        ],
      },
      options: {
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
            font: {
              family: 'FontAwesome',
              size: 14,
            },
          },
          deferred: false,
          tooltip: {
            callbacks: {
              title: this._getCustomTooltipTitle,
              label: this._getCustomTooltipLabel,
            },
          },
          legend: {
            labels: {
              generateLabels: () => {
                return Object.keys(this._teamsColorsIndices()).map(teamId => {
                  return {
                    text: this._teamsColorsIndices()[
                      teamId as unknown as number
                    ][1].getNames(),
                    fillStyle: this._getColor(
                      this._teamsColorsIndices()[
                        teamId as unknown as number
                      ]?.[0] ?? 0,
                    ),
                  };
                });
              },
            },
          },
        },
      } as unknown as CoreChartOptions<keyof ChartTypeRegistry>,
    });
  }
}
