import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChild,
  inject,
  Injector,
  Input,
  OnInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { debounceTime, map, Observable, of, takeUntil } from 'rxjs';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ControlDirective } from '@standalone/directives/control.directive';
import { isNgModel } from '@utils/utils';
import { ValidationErrorsComponent } from '@standalone/components/validation-errors/validation-errors.component';

@Component({
  selector: 'app-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ValidationErrorsComponent],
  templateUrl: './textarea.component.html',
  styleUrls: ['./textarea.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: TextareaComponent,
    },
  ],
})
export class TextareaComponent
  extends OnDestroyMixin(class {})
  implements ControlValueAccessor, OnInit, AfterContentInit
{
  ngAfterContentInit(): void {
    this.hasCustomControl = !!this.template;
    Promise.resolve().then(() => {
      if (this.template) {
        const input =
          this.template.element.nativeElement.querySelector('textarea') ??
          this.template.element.nativeElement;
        this.setInputMissingProperties(input);
        this.ctrl = this.template.control;
        !isNgModel(this.ctrl) && this.listenToCtrlValueChanges();
      }
    });
  }

  tailwindClass =
    'flex-auto outline-none group-[.lg]/text-area-wrapper:text-lg group-[.md]/text-area-wrapper:text-base group-[.sm]/text-area-wrapper:text-sm group-[.sm]/text-area-wrapper:px-2 group-[.sm]/text-area-wrapper:py-1 group-[.md]/text-area-wrapper:px-3 group-[.md]/text-area-wrapper:py-2 group-[.lg]/text-area-wrapper:px-5 group-[.lg]/text-area-wrapper:py-3';
  @Input()
  disabled = false;
  @Input()
  displayErrors = true;
  @Input()
  name = crypto.randomUUID();
  @ContentChild(ControlDirective)
  template?: ControlDirective;
  @Input()
  placeholder = '';
  @Input()
  label = 'Please Provide Label';
  @Input()
  labelColor = 'text-slate-700';
  @Input()
  inputColor = 'text-slate-700';
  @Input()
  size: 'sm' | 'md' | 'lg' = 'md';
  @Input()
  rows: string | number = 4;
  @Input()
  marginBottom = 'mb-5';
  @Input()
  noMargin = false;

  private injector = inject(Injector);
  private cdr = inject(ChangeDetectorRef);

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

  writeValue(value: string): void {
    this.control.setValue(value, { emitEvent: false });
    this.cdr.markForCheck();
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

  private listenToCtrlValueChanges() {
    this.ctrl?.valueChanges?.subscribe(() => this.cdr.markForCheck());
  }
}
