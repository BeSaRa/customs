import { WidgetState } from '@abstracts/widget-state';
import { Component } from '@angular/core';
import { BaseWidgetDirective } from '@modules/landing-page/directives/base-widget.directive';

export class CounterWidgetState extends WidgetState {}

@Component({
  selector: 'app-counter-widget',
  templateUrl: './counter-widget.component.html',
  styleUrl: './counter-widget.component.scss',
})
export class CounterWidgetComponent extends BaseWidgetDirective {}
