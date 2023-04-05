import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
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
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { debounceTime, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { ControlDirective } from '@standalone/directives/control.directive';
import { isNgModel } from '@utils/utils';
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
    provideNgxMask(),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class InputComponent
  implements ControlValueAccessor, OnInit, OnDestroy, AfterContentInit
{
  ngAfterContentInit(): void {
    this.hasMask = !!this.template;
    if (this.template) {
      this.setInputMaskMissingProperties(this.template.element.nativeElement);
      this.ctrl = this.template.control;
      !isNgModel(this.ctrl) && this.listenToCtrlValueChanges();
    }
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

  private injector = inject(Injector);
  private cdr = inject(ChangeDetectorRef);

  private ctrl!: NgControl | null;

  get errors(): Observable<ValidationErrors | null | undefined> {
    return of(null).pipe(
      debounceTime(200),
      map(() => this.ctrl?.errors)
    );
  }

  onChange!: (value: string | null) => void;
  onTouch!: () => void;

  control = new FormControl('');
  hasMask = false;
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

  setInputMaskMissingProperties(element: HTMLElement): void {
    element.classList.add(`input-form`, this.size, this.inputColor);
  }

  private listenToCtrlValueChanges() {
    this.ctrl?.valueChanges?.subscribe(() => this.cdr.markForCheck());
  }
}
