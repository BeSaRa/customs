import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ShrinkAnimation } from '@animations/shrink-animation';
import { NamesContract } from '@contracts/names-contract';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { takeUntil } from 'rxjs';
import { IconButtonComponent } from '../icon-button/icon-button.component';
import { InputComponent } from '../input/input.component';

@Component({
  selector: 'app-name-filter',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTooltipModule,
    IconButtonComponent,
    InputComponent,
  ],
  animations: [ShrinkAnimation],
  templateUrl: './name-filter.component.html',
  styleUrls: ['./name-filter.component.scss'],
})
export class NameFilterComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  fb = inject(FormBuilder);

  filterForm = this.fb.nonNullable.group({ arName: '', enName: '' });

  @Output() filterChange = new EventEmitter<Partial<NamesContract>>();

  isOpened = false;

  ngOnInit(): void {
    this.filterForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => this.filterChange.emit(value));
  }

  toggle() {
    this.filterForm.setValue({ arName: '', enName: '' });
    this.isOpened = !this.isOpened;
  }
}
