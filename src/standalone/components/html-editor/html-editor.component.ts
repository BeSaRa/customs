import { CommonModule } from '@angular/common';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ValidationErrorsComponent } from '@standalone/components/validation-errors/validation-errors.component';
import { Component, inject, Injector, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, NgControl, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { debounceTime, map, Observable, of, Subject, takeUntil } from 'rxjs';
import { LangService } from '@services/lang.service';

@Component({
  selector: 'app-html-editor',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, AngularEditorModule, ValidationErrorsComponent],
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
  @Input() displayErrors = true;
  tabelRows = new FormControl(2);
  tabelCols = new FormControl(2);
  headerBgColor = new FormControl('#8a1538');

  isTableWithTitle = false;
  lang = inject(LangService);
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
  isTableHeader() {
    this.isTableWithTitle = !this.isTableWithTitle;
  }
  createTable() {
    // let table = document.createElement('table');
    // table.setAttribute("id", new Date().toString());
    // table.insertRow();
    let tableString = '<table > <tbody>';
    if (this.isTableWithTitle)
      tableString = tableString.concat(
        `<tr style=" word-wrap: break-word;"> <td style="color: white; outline: ${this.headerBgColor.value} solid thin;" colspan="${this.tabelCols
          .value!}" align="center" bgcolor=${this.headerBgColor.value}></td></tr>`
      );
    for (let i = 1; i <= this.tabelRows.value!; i++) {
      tableString = tableString.concat('<tr>');
      for (let j = 1; j <= this.tabelCols.value!; j++)
        tableString = tableString.concat('<td style=" outline: lightgrey solid thin; " bgcolor="#EDEDED"></td>');
      tableString = tableString.concat('</tr>');
    }
    tableString = tableString.concat('</tbody></table>');
    return tableString;
  }
  get errors(): Observable<ValidationErrors | null | undefined> {
    return of(null).pipe(
      debounceTime(200),
      map(() => (this.ctrl?.dirty || this.ctrl?.touched ? this.ctrl?.errors : undefined))
    );
  }

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
