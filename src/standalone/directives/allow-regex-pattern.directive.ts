import {
  Directive,
  ElementRef,
  HostListener,
  inject,
  input,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
  selector: '[appAllowRegexPattern]',
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: AllowRegexPattern,
      multi: true,
    },
  ],
})
export class AllowRegexPattern implements ControlValueAccessor {
  regex = input.required<RegExp>({ alias: 'appAllowRegexPattern' });

  private elementRef = inject(ElementRef);

  private onChange!: (val: string) => void;
  private onTouched!: () => void;
  private value!: string;

  @HostListener('input', ['$event.target.value'])
  onInputChange(value: string) {
    const filteredValue: string = this._checkValue(value)
      ? value
      : value.slice(0, value.length - 1);
    this._updateTextInput(filteredValue, this.value !== filteredValue);
  }

  @HostListener('blur')
  onBlur() {
    this.onTouched();
  }

  writeValue(value: any): void {
    this.value = value ? String(value) : '';
    this._updateTextInput(value, false);
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    (this.elementRef.nativeElement as HTMLInputElement).disabled = isDisabled;
  }

  private _checkValue(val: string) {
    return this.regex().test(val);
  }

  private _updateTextInput(value: string, propagateChange: boolean) {
    (this.elementRef.nativeElement as HTMLInputElement).value = value;
    if (propagateChange) {
      this.onChange(value);
    }
    this.value = value;
  }
}
