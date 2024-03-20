import { Component, input } from '@angular/core';
import { LegalAffairsOffendersComponent } from '@standalone/components/legal-affairs-offenders/legal-affairs-offenders.component';
import { Investigation } from '@models/investigation';

@Component({
  selector: 'app-legal-affairs-procedures',
  standalone: true,
  imports: [LegalAffairsOffendersComponent],
  templateUrl: './legal-affairs-procedures.component.html',
  styleUrl: './legal-affairs-procedures.component.scss',
})
export class LegalAffairsProceduresComponent {
  model = input.required<Investigation>();
}
