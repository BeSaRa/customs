import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  ViewChild,
} from '@angular/core';
import { Investigation } from '@models/investigation';
import { OffendersViolationsPreviewComponent } from '../offenders-violations-preview/offenders-violations-preview.component';
import { LangService } from '@services/lang.service';
import { UnlinkedViolationsComponent } from '@standalone/components/unlinked-violations/unlinked-violations.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';

@Component({
  selector: 'app-summary-tab',
  templateUrl: './summary-tab.component.html',
  styleUrls: ['./summary-tab.component.scss'],
  standalone: true,
  imports: [
    UnlinkedViolationsComponent,
    OffendersViolationsPreviewComponent,
    TextareaComponent,
  ],
})
export class SummaryTabComponent {
  lang = inject(LangService);
  model = input.required<Investigation>();
  @Output() updateModel: EventEmitter<void> = new EventEmitter<void>();
  @ViewChild(OffendersViolationsPreviewComponent)
  offendersViolationsPreview!: OffendersViolationsPreviewComponent;
}
