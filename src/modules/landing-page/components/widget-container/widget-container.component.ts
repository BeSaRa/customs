import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  HostBinding,
  inject,
  Injector,
  input,
  runInInjectionContext,
} from '@angular/core';
import { FadeAnimation } from '@animations/fade-animation';
import { GrowAnimation } from '@animations/grow-animation';
import { WidgetTypeToComponentMap } from '@contracts/widgets-map';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LayoutWidgetModel } from '@models/layout-widget-model';
import { GridService } from '@services/grid.service';
import { LangService } from '@services/lang.service';
import { GridStackNode } from 'gridstack';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-widget-container',
  templateUrl: './widget-container.component.html',
  styleUrl: './widget-container.component.scss',
  animations: [GrowAnimation, FadeAnimation],
})
export class WidgetContainerComponent
  extends OnDestroyMixin(class {})
  implements AfterViewInit
{
  widgetData = input.required<LayoutWidgetModel>();

  elementRef = inject(ElementRef);
  gridService = inject(GridService);
  injector = inject(Injector);
  lang = inject(LangService);

  widgetGridStackNode?: GridStackNode;

  isCurrentComponentWidget = false;

  @HostBinding('attr.widget-id') private get _widgetId() {
    return this.widgetData().widgetDomId;
  }
  @HostBinding('@grow') private _grow = true;
  @HostBinding('class.draggable-animation') private get _draggable() {
    return !this.gridService.isStatic;
  }
  @HostBinding('style.animation-delay') private _delay =
    (Math.random() / 2).toFixed(1) + 's';

  ngAfterViewInit(): void {
    this._makeCurrentComponentAsGridWidget();
    this._listenToActiveGridChange();
    this._listenToLangChange();
  }

  removeSelf() {
    this.elementRef.nativeElement.classList.add('fade-out');

    // wait to animating element remove
    setTimeout(() => {
      this.gridService.removeWidget(this.widgetData().id);
      this.gridService
        .activeGrid()
        ?.removeWidget(this.elementRef.nativeElement);
    }, 150);
  }

  getWidgetComponentType() {
    return (
      WidgetTypeToComponentMap[this.widgetData().widgetDetails.type]
        .component ?? undefined
    );
  }

  private _makeCurrentComponentAsGridWidget() {
    this.widgetGridStackNode = this.gridService
      .activeGrid()
      ?.makeWidget(this.elementRef.nativeElement, {
        ...this.widgetData().getPosition(),
        ...this._getPosition(
          !this.widgetData().status,
          !!this.widgetData().status,
        ),
      })?.gridstackNode;
    this.isCurrentComponentWidget = !!this.widgetGridStackNode;
  }

  private _listenToActiveGridChange() {
    runInInjectionContext(this.injector, () =>
      effect(() => {
        if (!this.isCurrentComponentWidget) {
          this._makeCurrentComponentAsGridWidget();
        }
      }),
    );
  }

  private _listenToLangChange() {
    this.lang.change$.pipe(takeUntil(this.destroy$)).subscribe(_lang => {
      this.gridService
        .activeGrid()
        ?.engine.moveNode(this.widgetGridStackNode!, this._getPosition());
    });
  }

  private _getPosition(isDropped?: boolean, isLoaded?: boolean) {
    const isLtr = this.lang.getCurrent().direction === 'ltr';
    return {
      y:
        isDropped || isLoaded
          ? this.widgetData().getPosition()?.y
          : this.widgetGridStackNode?.y,
      x: isDropped
        ? isLtr
          ? this.widgetData().getPosition()?.x
          : (this.widgetData().getPosition()?.x ?? 0) -
            (this.widgetData().getPosition()?.w ?? 0) +
            1
        : isLoaded
          ? isLtr
            ? GridService.COLUMNS_COUNT -
              (this.widgetData().getPosition().x ?? 0) -
              (this.widgetData().getPosition().w ?? 0)
            : this.widgetData().getPosition().x
          : GridService.COLUMNS_COUNT -
            (this.widgetGridStackNode?.x ?? 0) -
            (this.widgetGridStackNode?.w ?? 0),
    };
  }
}
