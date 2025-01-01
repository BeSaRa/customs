import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { AssignedTo } from '@models/assigned-to';
import { NoneFilterColumn } from '@models/none-filter-column';
import { catchError, exhaustMap, of, throwError } from 'rxjs';
import { ignoreErrors } from '@utils/utils';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSort } from '@angular/material/sort';
import { MatTab } from '@angular/material/tabs';
import { OffenderService } from '@services/offender.service';
import { Offender } from '@models/offender';
import { Config } from '@constants/config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-modified-penalty',
  standalone: true,
  imports: [
    MatDialogModule,
    MatTableModule,
    ButtonComponent,
    IconButtonComponent,
    MatSort,
    MatTab,
    DatePipe,
  ],
  templateUrl: './modified-penalty.component.html',
  styleUrl: './modified-penalty.component.scss',
})
export class ModifiedPenaltyComponent implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  offenderService = inject(OffenderService);
  offenderId: number = this.data && (this.data.offenderId as number);
  modifiedPenaltyList = new MatTableDataSource<Offender>();

  columnsWrapper: ColumnsWrapper<AssignedTo> = new ColumnsWrapper(
    new NoneFilterColumn('penalty'),
    new NoneFilterColumn('date'),
    new NoneFilterColumn('time'),
    new NoneFilterColumn('penaltySigner'),
    new NoneFilterColumn('penaltySignerRole'),
    new NoneFilterColumn('status'),
  );
  ngOnInit(): void {
    this.loadOffenderPenalties();
  }
  loadOffenderPenalties() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.offenderService
            .loadPenaltyModification(this.offenderId)
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe(data => {
        this.modifiedPenaltyList = new MatTableDataSource(data.reverse());
      });
  }

  protected readonly Config = Config;
}
