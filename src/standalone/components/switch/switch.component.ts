import { CommonModule } from '@angular/common';
import {
  AfterContentInit,
  Component,
  ContentChild,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ControlDirective } from '@standalone/directives/control.directive';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-switch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatSlideToggleModule],
  templateUrl: './switch.component.html',
  styleUrls: ['./switch.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: SwitchComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class SwitchComponent
  implements ControlValueAccessor, OnInit, OnDestroy, AfterContentInit
{
  @Input()
  trueValue: unknown = true;
  @Input()
  falseValue: unknown = false;
  @Input()
  disabled = false;
  @Input()
  label = '';

  @ContentChild(ControlDirective)
  template?: ControlDirective;

  ngAfterContentInit(): void {
    this.hasCustomControl = !!this.template;
    Promise.resolve().then(() => {
      if (this.template) {
        this.ctrl = this.template.control;
      }
    });
  }

  private destroy$ = new Subject<void>();

  private injector = inject(Injector);

  private ctrl!: NgControl | null;

  onChange!: (value: unknown) => void;
  onTouch!: () => void;

  control = new FormControl(true);
  hasCustomControl = false;
  // noinspection JSUnusedLocalSymbols

  ngOnInit(): void {
    this.ctrl = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });

    this.control.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (isChecked) =>
          this.onChange &&
          this.onChange(isChecked ? this.trueValue : this.falseValue)
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

  writeValue(value: unknown): void {
    this.control.setValue(value == this.trueValue, {
      emitEvent: false,
    });
  }

  registerOnChange(fn: (v: unknown) => void): void {
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

  switchTouch() {
    this.onTouch && this.onTouch();
  }
}
