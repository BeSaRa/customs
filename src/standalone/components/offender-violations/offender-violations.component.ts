import { Component, inject, input } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { OffenderViolation } from '@models/offender-violation';

@Component({
  selector: 'app-offender-violations',
  standalone: true,
  imports: [MatTooltip],
  templateUrl: './offender-violations.component.html',
  styleUrl: './offender-violations.component.scss',
})
export class OffenderViolationsComponent {
  lang = inject(LangService);
  violations = input.required<OffenderViolation[]>();
}
