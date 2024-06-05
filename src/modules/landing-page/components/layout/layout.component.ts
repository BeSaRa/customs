import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { WidgetTypes } from '@enums/widget-types';
import { GridService } from '@services/grid.service';
import { LangService } from '@services/lang.service';
import { WidgetService } from '@services/widget.service';
import { GridStackOptions, GridStackPosition } from 'gridstack';
import { droppedCB, GridstackComponent, nodesCB } from 'gridstack/dist/angular';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('grid') grid!: GridstackComponent;

  gridService = inject(GridService);
  widgetService = inject(WidgetService);
  lang = inject(LangService);

  readonly WidgetTypes = WidgetTypes;

  get isStatic() {
    return this.gridService.isStatic;
  }

  public gridOptions: GridStackOptions = {
    rtl: true,
    float: true,
    margin: 5,
    acceptWidgets: 'app-new-widget',
    removable: '#trash',
    column: GridService.COLUMNS_COUNT,
  };

  selectedLayout = new FormControl(0);
  layouts = [
    { value: 0, label: 'first layout' },
    { value: 1, label: 'second layout' },
  ];

  change(event: nodesCB) {
    const _updates = event.nodes.reduce(
      (acc, cur) => {
        const { h, w, y } = cur;
        let { x } = cur;
        if (this.lang.getCurrent().direction === 'ltr') {
          x = GridService.COLUMNS_COUNT - (w ?? 0) - (x ?? 0);
        }
        acc[
          (
            cur.el?.attributes[
              'widget-id' as keyof NamedNodeMap
            ] as unknown as { nodeValue: string | number }
          ).nodeValue
        ] = {
          h,
          w,
          x,
          y,
        };
        return acc;
      },
      {} as Record<string | number, GridStackPosition>,
    );
    this.gridService.patchWidgetsUpdates(_updates);
    console.log(_updates);
  }

  drop(event: droppedCB) {
    this.gridService.addWidget({
      widgetDetails: this.widgetService.getWidget(
        (
          event.newNode.el?.attributes[
            'widget-type' as keyof NamedNodeMap
          ] as unknown as { nodeValue: WidgetTypes }
        ).nodeValue,
      ),
      position: { x: event.newNode.x, y: event.newNode.y },
    });
    this.grid.grid?.removeWidget(event.newNode.el!);
    console.log(event);
  }

  enableEdit() {
    this.gridService.enable();
  }

  save() {
    this.gridService.disable();
  }

  cancel() {
    this.gridService.revert();
  }

  ngAfterViewInit(): void {
    this.gridService.setActiveGrid(this.grid.grid);
    this.gridService.disable();
    this.selectedLayout.valueChanges.subscribe(v => {
      this.gridService.switch(v ?? 0);
    });
  }

  ngOnDestroy(): void {
    this.gridService.setActiveGrid(undefined);
  }
}
