import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import {
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
  NgControl,
  ReactiveFormsModule,
} from '@angular/forms';
import {
  MatSlideToggleChange,
  MatSlideToggleModule,
} from '@angular/material/slide-toggle';
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
  implements ControlValueAccessor, OnInit, OnDestroy
{
  @Input()
  trueValue: unknown = true;
  @Input()
  falseValue: unknown = false;
  @Input()
  disabled = false;
  @Input()
  label = '';

  @Output()
  changed: EventEmitter<MatSlideToggleChange> =
    new EventEmitter<MatSlideToggleChange>();

  private destroy$ = new Subject<void>();

  private injector = inject(Injector);

  private ctrl!: NgControl | null;

  onChange!: (value: unknown) => void;
  onTouch!: () => void;

  control = new FormControl(true);

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

  change($event: MatSlideToggleChange) {
    this.changed.emit($event);
    this.onChange &&
      this.onChange($event.checked ? this.trueValue : this.falseValue);
  }
}
