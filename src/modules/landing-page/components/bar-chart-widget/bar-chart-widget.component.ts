import { WidgetState } from '@abstracts/widget-state';
import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Colors } from '@enums/colors';
import { InboxCounter } from '@models/inbox-counter';
import { BaseWidgetDirective } from '@modules/landing-page/directives/base-widget.directive';
import { getHexColorWithOpacity } from '@utils/utils';
import { Chart, ChartTypeRegistry, CoreChartOptions } from 'chart.js/auto';
import { takeUntil } from 'rxjs';

export class BarChartWidgetState extends WidgetState {}

@Component({
  selector: 'app-bar-chart-widget',
  templateUrl: './bar-chart-widget.component.html',
  styleUrl: './bar-chart-widget.component.scss',
})
export class BarChartWidgetComponent
  extends BaseWidgetDirective
  implements AfterViewInit
{
  @ViewChild('canvas') private _canvas!: ElementRef<HTMLCanvasElement>;

  chart?: Chart;

  private _updateEffect = effect(() => {
    this._updateChartData();
  });

  override _isMulti() {
    return true;
  }

  ngAfterViewInit(): void {
    this._initializeChart();
    this._listToLangChange();
  }

  _listToLangChange() {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this._updateChartData();
    });
  }

  private _updateChartData() {
    const _counters = this.widgetCounters();
    if (this.chart) {
      this.chart.data.labels = this._getLabels(_counters);
      this.chart.data.datasets[0].data = this._getValues(_counters);
      this.chart.update();
    }
  }

  private _getLabels(counters: InboxCounter[]) {
    return counters.map(counter => counter.counterInfo.getNames());
  }

  private _getValues(counters: InboxCounter[]) {
    return counters.map(counter => counter.inboxCount);
  }

  private _initializeChart() {
    this.chart = new Chart(this._canvas.nativeElement, {
      type: 'bar',
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            label: '',
            backgroundColor: getHexColorWithOpacity(Colors.PRIMARY, 0.99),
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
        },
      } as unknown as CoreChartOptions<keyof ChartTypeRegistry>,
    });
  }
}
