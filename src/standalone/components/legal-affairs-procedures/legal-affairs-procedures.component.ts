import { Component, input } from '@angular/core';
import { PersonsListComponent } from '@standalone/components/legal-affairs-offenders/persons-list.component';
import { Investigation } from '@models/investigation';

@Component({
  selector: 'app-legal-affairs-procedures',
  standalone: true,
  imports: [PersonsListComponent],
  templateUrl: './legal-affairs-procedures.component.html',
  styleUrl: './legal-affairs-procedures.component.scss',
})
export class LegalAffairsProceduresComponent {
  model = input.required<Investigation>();
}
