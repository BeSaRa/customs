import { CommonModule } from '@angular/common';
import { Component, OnInit, Input, inject } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Investigation } from '@models/investigation';
import { OffendersViolationsPreviewComponent } from '../offenders-violations-preview/offenders-violations-preview.component';
import { LangService } from '@services/lang.service';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    OffendersViolationsPreviewComponent,
  ]
})
export class SummaryTabComponent implements OnInit {
  lang = inject(LangService);

  @Input() form!: FormGroup;
  @Input() model?: Investigation;
  
  constructor() { }

  ngOnInit() {
  }

}
