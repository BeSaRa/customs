import {
  AfterContentInit,
  Component,
  ContentChild,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { ValidationErrorsComponent } from '@standalone/components/validation-errors/validation-errors.component';
import { NgxMaskDirective } from 'ngx-mask';
import { debounceTime, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputPrefixDirective } from '@standalone/directives/input-prefix.directive';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';

@Component({
  selector: 'app-input',
  standalone: true,
  imports: [
    CommonModule,
    ValidationErrorsComponent,
    NgxMaskDirective,
    ReactiveFormsModule,
  ],
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent
  implements ControlValueAccessor, OnInit, OnDestroy, AfterContentInit
{
  ngAfterContentInit(): void {
    this.hasCustomControl = !!this.template;
    Promise.resolve().then(() => {
      if (this.template) {
        const input =
          this.template.element.nativeElement.querySelector('input') ??
          this.template.element.nativeElement;
        this.setInputMissingProperties(input);
        this.ctrl = this.template.control;
      }
    });
  }

  private destroy$ = new Subject<void>();
  @Input()
  disabled = false;
  @Input()
  displayErrors = true;
  @Input()
  size: 'sm' | 'md' | 'lg' = 'md';
  @Input()
  placeholder = '';
  @Input()
  label = 'Please Provide Label';
  @Input()
  labelColor = 'text-slate-700';
  @Input()
  inputColor = 'text-slate-700';
  @Input()
  type = 'text';
  @Input()
  marginBottom = 'mb-5';
  @Input()
  noMargin = false;
  @Input()
  name = crypto.randomUUID();

  @ContentChild(ControlDirective)
  template?: ControlDirective;

  @ContentChild(InputPrefixDirective)
  inputPrefix?: InputPrefixDirective;

  @ContentChild(InputSuffixDirective)
  inputSuffix?: InputSuffixDirective;

  tailwindClass =
    'flex-auto ltr:peer-[.suffix]:pr-0 rtl:peer-[.suffix]:pl-0 ltr:peer-[.prefix]:pl-0 rtl:peer-[.prefix]:pr-0 outline-none group-[.lg]/input-wrapper:text-lg group-[.md]/input-wrapper:text-base group-[.sm]/input-wrapper:text-sm group-[.sm]/input-wrapper:px-2 group-[.sm]/input-wrapper:py-1 group-[.md]/input-wrapper:px-3 group-[.md]/input-wrapper:py-2 group-[.lg]/input-wrapper:px-5 group-[.lg]/input-wrapper:py-3';

  private injector = inject(Injector);

  private ctrl!: NgControl | null;

  get errors(): Observable<ValidationErrors | null | undefined> {
    return of(null).pipe(
      debounceTime(200),
      map(() =>
        this.ctrl?.dirty || this.ctrl?.touched ? this.ctrl?.errors : undefined
      )
    );
  }

  onChange!: (value: string | null) => void;
  onTouch!: () => void;

  control = new FormControl('');
  hasCustomControl = false;
  // noinspection JSUnusedLocalSymbols
  private values = this.control.valueChanges
    .pipe(takeUntil(this.destroy$))
    .subscribe((value) => this.onChange && this.onChange(value));

  ngOnInit(): void {
    this.ctrl = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });
  }

  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
    this.disabled
      ? this.control.disable({ emitEvent: false })
      : this.control.enable({ emitEvent: false });
  }

  inputTouch() {
    this.onTouch && this.onTouch();
  }

  setInputMissingProperties(element: HTMLElement): void {
    element.classList.add(...this.tailwindClass.split(' '));
  }
}
