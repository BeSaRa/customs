import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'highlight',
  standalone: true,
})
export class HighlightPipe implements PipeTransform {
  sanitizer = inject(DomSanitizer);
  transform(value: string, args: string): SafeHtml {
    if (!args) {
      return value;
    }
    // Match in a case-insensitive
    const re = new RegExp(args, 'gi');
    const match = value.match(re);

    // If there's no match, just return the original value.
    if (!match) {
      return value;
    }

    const result = value.replace(re, '<mark>' + match[0] + '</mark>');
    return this.sanitizer.bypassSecurityTrustHtml(result);
  }
}
