import { WidgetState } from '@abstracts/widget-state';
import { Type } from '@angular/core';
import { Constructor } from '@app-types/constructors';
import { WidgetTypes } from '@enums/widget-types';
import {
  BarChartWidgetComponent,
  BarChartWidgetState,
} from '@modules/landing-page/components/bar-chart-widget/bar-chart-widget.component';
import {
  CounterWidgetComponent,
  CounterWidgetState,
} from '@modules/landing-page/components/counter-widget/counter-widget.component';
import {
  PieChartWidgetComponent,
  PieChartWidgetState,
} from '@modules/landing-page/components/pie-chart-widget/pie-chart-widget.component';
import { BaseWidgetDirective } from '@modules/landing-page/directives/base-widget.directive';
import { GridStackWidget } from 'gridstack';

export const WidgetTypeToComponentMap: Record<
  WidgetTypes,
  {
    component: Type<BaseWidgetDirective>;
    stateOptions: Constructor<WidgetState>;
    initialSize: GridStackWidget;
    iconUrl: string;
  }
> = {
  [WidgetTypes.BAR_CHART]: {
    component: BarChartWidgetComponent,
    stateOptions: BarChartWidgetState,
    initialSize: { w: 40, h: 24 },
    iconUrl: `assets/images/widgets-icons/bar-chart.png`,
  },
  [WidgetTypes.PIE_CHART]: {
    component: PieChartWidgetComponent,
    stateOptions: PieChartWidgetState,
    initialSize: { w: 24, h: 24 },
    iconUrl: `assets/images/widgets-icons/pie-chart.png`,
  },
  [WidgetTypes.COUNTER]: {
    component: CounterWidgetComponent,
    stateOptions: CounterWidgetState,
    initialSize: { w: 24, h: 12 },
    iconUrl: `assets/images/widgets-icons/counter.png`,
  },
};
