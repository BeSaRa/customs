import { Component, EventEmitter, input, Output } from '@angular/core';
import { PersonsListComponent } from '@standalone/components/legal-affairs-offenders/persons-list.component';
import { Investigation } from '@models/investigation';
import { MemorandumOpinionListComponent } from '@standalone/components/memorandum-opinion-list/memorandum-opinion-list.component';

@Component({
  selector: 'app-legal-affairs-procedures',
  standalone: true,
  imports: [PersonsListComponent, MemorandumOpinionListComponent],
  templateUrl: './legal-affairs-procedures.component.html',
  styleUrl: './legal-affairs-procedures.component.scss',
})
export class LegalAffairsProceduresComponent {
  model = input.required<Investigation>();
  @Output()
  updateModel = new EventEmitter<void>();
}
