import { WidgetState } from '@abstracts/widget-state';
import {
  AfterViewInit,
  Component,
  inject,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserClick } from '@enums/user-click';
import { WidgetTypes } from '@enums/widget-types';
import { LayoutModel } from '@models/layout-model';
import { DialogService } from '@services/dialog.service';
import { GridService } from '@services/grid.service';
import { LangService } from '@services/lang.service';
import { LayoutService } from '@services/layout.service';
import { WidgetService } from '@services/widget.service';
import { GridStackOptions, GridStackPosition } from 'gridstack';
import { droppedCB, GridstackComponent, nodesCB } from 'gridstack/dist/angular';
import { filter, switchMap, take, tap } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss',
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
  @ViewChild('grid') grid!: GridstackComponent;

  layoutService = inject(LayoutService);
  gridService = inject(GridService);
  widgetService = inject(WidgetService);
  lang = inject(LangService);
  dialog = inject(DialogService);

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

  selectedLayout = new FormControl(this.layoutService.currentLayout()?.id);
  layouts = this.layoutService.layouts;

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
    this.gridService.updateWidgetsPosition(_updates);
  }

  drop(event: droppedCB) {
    const isLtr = this.lang.getCurrent().direction === 'ltr';
    const _widgetDetails = this.widgetService.getWidgetByType(
      (
        event.newNode.el?.attributes[
          'widget-type' as keyof NamedNodeMap
        ] as unknown as { nodeValue: WidgetTypes }
      ).nodeValue,
    );
    this.gridService.addWidget({
      widgetDetails: _widgetDetails,
      widgetId: _widgetDetails?.id,
      layoutId: this.layoutService.currentLayout()?.id,
      position: {
        x: isLtr
          ? GridService.COLUMNS_COUNT -
            (event.newNode.x ?? 0) -
            (_widgetDetails.defaultSize.w ?? 0)
          : (event.newNode?.x ?? 0) - (_widgetDetails.defaultSize.w ?? 0) + 6,
        y: event.newNode.y,
      },
      stateOptions: {} as WidgetState,
    });

    this.grid.grid?.removeWidget(event.newNode.el!);
  }

  enableEdit() {
    this.gridService.enableEdit();
  }

  save() {
    this.gridService.saveChanges();
  }

  cancel() {
    this.gridService.revertChanges();
  }

  ngAfterViewInit(): void {
    this.gridService.setActiveGrid(this.grid.grid);
    setTimeout(() => {
      this.gridService.disableEdit();
    }, 0);
    this.selectedLayout.valueChanges.subscribe(v => {
      this.layoutService.setCurrentLayout(this.layoutService.layoutsMap[v!]);
    });
  }

  ngOnDestroy(): void {
    this.gridService.setActiveGrid(undefined);
  }

  openCreateLayout() {
    let _new: LayoutModel;
    this.layoutService
      .openCreateDialog(undefined)
      .afterClosed()
      .pipe(
        filter((model): model is LayoutModel => {
          return model instanceof LayoutModel;
        }),
        tap(model => (_new = model)),
        switchMap(() => this.layoutService.load()),
        take(1),
      )
      .subscribe(() => {
        this.selectedLayout.setValue(_new.id);
      });
  }

  deleteLayout() {
    this.dialog
      .confirm(
        this.lang.map.msg_delete_x_confirm.change({
          x: this.layoutService.currentLayout()?.getNames(),
        }),
      )
      .afterClosed()
      .pipe(
        filter(value => value === UserClick.YES),
        switchMap(() =>
          this.layoutService.delete(this.layoutService.currentLayout()!.id),
        ),
        switchMap(() => this.layoutService.load()),
        take(1),
      )
      .subscribe(() => {
        this.selectedLayout.setValue(this.layoutService.currentLayout()?.id, {
          emitEvent: false,
        });
      });
  }
}
