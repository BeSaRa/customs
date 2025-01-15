import { WidgetState } from '@abstracts/widget-state';
import { computed, inject, Injectable, signal } from '@angular/core';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { GridService } from './grid.service';
import { InboxCounterService } from './inbox-counter.service';

@Injectable({
  providedIn: 'root',
})
export class WidgetOptionsService {
  inboxCounterService = inject(InboxCounterService);
  gridService = inject(GridService);

  isMulti!: boolean;
  private _widgetData!: LayoutWidgetModel;
  get widgetData() {
    return this._widgetData;
  }

  private _widgetState = signal<WidgetState | undefined>(undefined);
  widgetState = computed(() => this._widgetState());

  widgetCounters = computed(() => {
    return this.inboxCounterService
      .userCounters()
      .filter(c => this.widgetState()?.countersIds?.find(id => id === c.id));
  });

  setWidgetData(data: LayoutWidgetModel) {
    this._widgetData = data;
    this._widgetState.set(data.stateOptions);
  }

  updateState(newState: WidgetState) {
    const _newState = LayoutWidgetModel.getStateInstance(
      this._widgetData.widgetDetails.type,
      newState,
    );
    this._widgetState.set(_newState);
    this.gridService.updateWidgetState(
      this._widgetData.id ?? this._widgetData.widgetDomId,
      _newState,
    );
  }
}
