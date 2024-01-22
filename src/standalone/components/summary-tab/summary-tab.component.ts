import { Component, inject, Input, ViewChild } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Investigation } from '@models/investigation';
import { OffendersViolationsPreviewComponent } from '../offenders-violations-preview/offenders-violations-preview.component';
import { LangService } from '@services/lang.service';
import { UnlinkedViolationsComponent } from '@standalone/components/unlinked-violations/unlinked-violations.component';
import { Violation } from '@models/violation';
import { Offender } from '@models/offender';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FormsModule,
    UnlinkedViolationsComponent,
    OffendersViolationsPreviewComponent,
    TextareaComponent,
  ],
})
export class SummaryTabComponent {
  lang = inject(LangService);
  @ViewChild(OffendersViolationsPreviewComponent)
  offendersViolationsPreview!: OffendersViolationsPreviewComponent;
  @Input() offenders: Offender[] = [];
  @Input() violations: Violation[] = [];
  @Input() form!: FormGroup;
  @Input() model?: Investigation;
}
