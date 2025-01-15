import {
  AfterViewInit,
  computed,
  Directive,
  effect,
  ElementRef,
  ViewChild,
} from '@angular/core';
import { Colors } from '@enums/colors';
import { Chart, ChartType, TooltipItem } from 'chart.js';
import { takeUntil } from 'rxjs';
import { BaseWidgetDirective } from './base-widget.directive';

@Directive({
  selector: '[appBaseChartWidget]',
  standalone: true,
})
export abstract class BaseChartWidgetDirective
  extends BaseWidgetDirective
  implements AfterViewInit
{
  @ViewChild('canvas') protected _canvas!: ElementRef<HTMLCanvasElement>;
  chart?: Chart;

  private _updateEffect = effect(() => {
    this._updateChartData();
  });

  protected _chartWidgetCounters = computed(() => {
    return this.widgetCounters().sort(
      (c1, c2) => c2.inboxCount - c1.inboxCount,
    );
  });

  override _isMulti() {
    return true;
  }

  ngAfterViewInit(): void {
    this._initializeChart();
    this._listenToLangChange();
  }

  protected _listenToLangChange() {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this._updateChartData();
    });
  }

  protected _updateChartData() {
    if (this.chart) {
      this.chart.data.labels = this._getLabels();
      this.chart.data.datasets[0].data = this._getValues();
      this.chart.update();
    }
  }

  protected _getCounterAtIndex = (index: number) => {
    return this._chartWidgetCounters()[index];
  };

  protected _getLabels = () => {
    return this._chartWidgetCounters().map(counter =>
      counter.counterInfo.getNames(),
    );
  };

  protected _getValues = () => {
    return this._chartWidgetCounters().map(counter => counter.inboxCount);
  };

  protected _getCustomTooltipTitle = (context: TooltipItem<ChartType>[]) => {
    const _counter = this._getCounterAtIndex(context[0].dataIndex);
    return _counter.teamInfo.getNames();
  };

  protected _getCustomTooltipLabel = (context: TooltipItem<ChartType>) => {
    const _counter = this._getCounterAtIndex(context.dataIndex);
    return `${_counter.counterInfo.getNames()}  ${context.formattedValue}`;
  };

  protected _getColor = (index: number) => {
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
  };

  protected abstract _initializeChart(): void;
}
