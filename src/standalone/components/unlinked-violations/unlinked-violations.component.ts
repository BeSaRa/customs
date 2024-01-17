import { Component, inject, Input } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatMenuModule } from '@angular/material/menu';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { Violation } from '@models/violation';
import { AppTableDataSource } from '@models/app-table-data-source';
import { Investigation } from '@models/investigation';

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

  dataSource = new AppTableDataSource<Violation>([]);
  columns: string[] = ['violationName', 'classification', 'description'];

  @Input({ required: true }) set data(violations: Violation[]) {
    this.dataSource = new AppTableDataSource(
      violations.filter(
        (violation) =>
          !this.investigationModel?.offenderViolationInfo.filter(
            (offenderVioliation) =>
              offenderVioliation.violationId == violation.id
          ).length
      )
    );
  }
  @Input() investigationModel?: Investigation;
}