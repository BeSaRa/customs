import { Directive, inject, TemplateRef } from '@angular/core';

@Directive({
  selector: '[appOptionTemplate]',
  standalone: true,
})
export class OptionTemplateDirective {
  templateRef = inject(TemplateRef);
}
