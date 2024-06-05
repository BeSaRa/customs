import {
  Component,
  ElementRef,
  HostBinding,
  inject,
  input,
  OnInit,
} from '@angular/core';
import { WidgetModel } from '@models/widget-model';
import { GridStack } from 'gridstack';

@Component({
  selector: 'app-new-widget',
  templateUrl: './new-widget.component.html',
  styleUrl: './new-widget.component.scss',
})
export class NewWidgetComponent implements OnInit {
  widget = input.required<WidgetModel>();

  elementRef = inject(ElementRef);

  @HostBinding('attr.widget-type') get widgetType() {
    return this.widget().type;
  }

  ngOnInit(): void {
    GridStack.setupDragIn([this.elementRef.nativeElement], {
      appendTo: 'body',
      helper: 'clone',
    });
  }
}
