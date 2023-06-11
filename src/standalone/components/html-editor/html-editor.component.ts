import { CommonModule } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { Component, inject, Injector, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-html-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AngularEditorModule],
  templateUrl: './html-editor.component.html',
  styleUrls: ['./html-editor.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: HtmlEditorComponent,
    },
  ],
  encapsulation: ViewEncapsulation.None,
})
export class HtmlEditorComponent implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label = '';
  @Input() editorId = '';

  private destroy$ = new Subject<void>();

  private injector = inject(Injector);

  private ctrl!: NgControl | null;

  onChange!: (value: string | null) => void;
  onTouch!: () => void;

  config: AngularEditorConfig = {
    editable: true,
    sanitize: false,
    spellcheck: true,
    height: '15rem',
    minHeight: '5rem',
    placeholder: 'Enter email body template here ...',
    translate: 'no',
    defaultParagraphSeparator: 'p',
    defaultFontName: 'Arial',
    toolbarHiddenButtons: [],
  };
  control = new FormControl('');

  ngOnInit(): void {
    this.ctrl = this.injector.get(NgControl, null, {
      self: true,
      optional: true,
    });

    this.control.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => this.onChange && this.onChange(value));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }
  writeValue(value: string): void {
    this.control.setValue(value, {
      emitEvent: true,
    });
  }
  registerOnChange(fn: (v: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouch = fn;
  }

  switchTouch() {
    this.onTouch && this.onTouch();
  }
}