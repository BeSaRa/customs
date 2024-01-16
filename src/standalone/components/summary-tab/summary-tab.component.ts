import { Component, inject, Input } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Investigation } from '@models/investigation';
import { OffendersViolationsPreviewComponent } from '../offenders-violations-preview/offenders-violations-preview.component';
import { LangService } from '@services/lang.service';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule, OffendersViolationsPreviewComponent],
})
export class SummaryTabComponent {
  lang = inject(LangService);

  @Input() form!: FormGroup;
  @Input() model?: Investigation;
}
