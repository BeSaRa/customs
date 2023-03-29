import { Directive, ElementRef, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appControl]',
  standalone: true,
})
export class ControlDirective {
  control = inject(NgControl);
  element = inject(ElementRef);
}
