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
import { Chart, ChartTypeRegistry, CoreChartOptions } from 'chart.js/auto';
import { takeUntil } from 'rxjs';

export class PieChartWidgetState extends WidgetState {}

@Component({
  selector: 'app-pie-chart-widget',
  templateUrl: './pie-chart-widget.component.html',
  styleUrl: './pie-chart-widget.component.scss',
})
export class PieChartWidgetComponent
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
    const _counters = this.widgetCounters().sort(
      (c1, c2) => c2.inboxCount - c1.inboxCount,
    );
    if (this.chart) {
      this.chart.data.labels = this._getLabels(_counters);
      this.chart.data.datasets[0].data = this._getValues(_counters);
      const colors = _counters.map((_, index) => this._getColor(index));
      this.chart.data.datasets[0].backgroundColor = colors;
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
      type: 'pie',
      data: {
        labels: [],
        datasets: [{ data: [] }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
          },
        },
      } as unknown as CoreChartOptions<keyof ChartTypeRegistry>,
    });
  }

  private _getColor(index: number): string {
    const colors = [
      Colors.PRIMARY,
      Colors.SECONDARY,
      Colors.BLACK,
      Colors.WHITE,
      Colors.DARK_BLUE,
      Colors.NAKHEEL,
      Colors.SEA,
      Colors.SUNRISE,
    ];
    return colors[index % colors.length];
  }
}
