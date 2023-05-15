import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputComponent } from '@standalone/components/input/input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { InputSuffixDirective } from '@standalone/directives/input-suffix.directive';
import { MatRippleModule } from '@angular/material/core';
import { debounceTime, of, takeUntil } from 'rxjs';
import { AppIcons } from '@constants/app-icons';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { isEmptyObject } from '@utils/utils';
import { ColumnMapContract } from '@contracts/column-map-contract';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';

@Component({
  selector: 'app-filter-column',
  standalone: true,
  imports: [
    CommonModule,
    InputComponent,
    ReactiveFormsModule,
    MatIconModule,
    InputSuffixDirective,
    MatRippleModule,
    IconButtonComponent,
    MatTooltipModule,
    MatSelectModule,
    MatAutocompleteModule,
    SelectInputComponent,
  ],
  templateUrl: './filter-column.component.html',
  styleUrls: ['./filter-column.component.scss'],
})
export class FilterColumnComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  @Input()
  column?: ColumnMapContract<unknown>;
  control = new FormControl('');
  @Output()
  filterChange = new EventEmitter<{ key: string; value: null | string }>();

  lang = inject(LangService);

  protected readonly AppIcons = AppIcons;

  ngOnInit(): void {
    this.listenToControl();
    this.listenToClearValue();
  }

  private listenToControl() {
    if (!this.column || !this.column.filter) return;

    this.control.valueChanges.pipe(debounceTime(250)).subscribe((value) => {
      this.column &&
        this.filterChange.emit({
          key: this.column.config.bindKey,
          value,
        });
    });
  }

  clear() {
    this.control.dirty && this.control.reset();
  }

  private listenToClearValue() {
    this.column?.clear.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.control.reset(null, { emitEvent: false });
    });
  }

  private isType(
    type: 'text' | 'select' | 'date' | 'none',
    hasFilter = true
  ): boolean {
    return !!(
      this.column &&
      this.column.config.filter === hasFilter &&
      this.column.config.type === type
    );
  }

  isText(): boolean {
    return this.isType('text');
  }

  isSelect(): boolean {
    return this.isType('select');
  }

  isActions(): boolean {
    return !!(
      this.isType('none', false) &&
      this.column &&
      this.column.config.name === 'actions'
    );
  }

  clearAllFilters() {
    this.column?.filter().next({});
    this.column?.clear.next();
  }

  noFilteredColumns() {
    return (
      this.column?.filter().value && isEmptyObject(this.column?.filter().value)
    );
  }

  get options() {
    return (
      (this.column && this.column.config && this.column.config.options) ||
      of([])
    );
  }
}
