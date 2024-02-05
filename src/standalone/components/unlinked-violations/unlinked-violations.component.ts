import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { Investigation } from '@models/investigation';
import { Violation } from '@models/violation';

@Component({
  selector: 'app-unlinked-violations',
  standalone: true,
  imports: [
    DatePipe,
    IconButtonComponent,
    MatMenuModule,
    MatSortModule,
    MatTableModule,
  ],
  templateUrl: './unlinked-violations.component.html',
  styleUrl: './unlinked-violations.component.scss',
})
export class UnlinkedViolationsComponent {
  lang = inject(LangService);
  model = input.required<Investigation>();
  columns: string[] = ['violationName', 'classification', 'description'];
  filter = input<(c: Violation) => boolean>(v => !!v);
  violations = computed(() => {
    const linkedViolationsIds = this.model().offenderViolationInfo.map(
      i => i.violationId,
    );
    return this.model().violationInfo.filter(
      v => !linkedViolationsIds.includes(v.id) && this.filter()(v),
    );
  });
}
