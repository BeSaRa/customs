import { Component, computed, inject, input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { Violation } from '@models/violation';
import { AppTableDataSource } from '@models/app-table-data-source';
import { Offender } from '@models/offender';
import { OffenderViolation } from '@models/offender-violation';

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

  columns: string[] = ['violationName', 'classification', 'description'];
  offenders = input([] as Offender[]);
  data = input([] as Violation[]);
  violations = computed(() => {
    return new AppTableDataSource(
      this.data().filter(
        violation =>
          !this.offenders()
            .reduce((prev: OffenderViolation[], curr): OffenderViolation[] => {
              return [...prev, ...curr.violations];
            }, [])
            .filter(offenderViolation => {
              return offenderViolation.violationId === violation.id;
            }).length,
      ),
    );
  });
}
