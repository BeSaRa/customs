import { Component, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { LookupService } from '@services/lookup.service';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatCard } from '@angular/material/card';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
} from '@angular/material/table';
import { NgTemplateOutlet } from '@angular/common';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import {
  catchError,
  exhaustMap,
  filter,
  isObservable,
  Observable,
  of,
  Subject,
  switchMap,
  throwError,
} from 'rxjs';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { ignoreErrors } from '@utils/utils';
import { PenaltyDecision } from '@models/penalty-decision';
import { Pagination } from '@models/pagination';
import { PenaltyDecisionCriteria } from '@models/penalty-decision-criteria';
import { TextFilterColumn } from '@models/text-filter-column';
import { GrievancePopupComponent } from '@standalone/popups/grievance-popup/grievance-popup.component';
import { UserClick } from '@enums/user-click';
import { GrievanceListComponent } from '@standalone/components/grievance-list/grievance-list.component';
import { OffenderService } from '@services/offender.service';
import { Offender } from '@models/offender';

@Component({
  selector: 'app-archivist-grievance',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonComponent,
    ControlDirective,
    IconButtonComponent,
    InputComponent,
    MatCard,
    MatCell,
    NgTemplateOutlet,
    MatTabGroup,
    MatTab,
    MatTable,
    MatSort,
    MatColumnDef,
    MatHeaderCellDef,
    MatCellDef,
    MatTooltip,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    MatRow,
    MatHeaderRow,
    MatHeaderCell,
    SelectInputComponent,
    MatDatepicker,
    MatDatepickerInput,
    GrievanceListComponent,
  ],
  templateUrl: './archivist-grievance.component.html',
  styleUrl: './archivist-grievance.component.scss',
})
export class ArchivistGrievanceComponent implements OnInit {
  offenderService = inject(OffenderService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);

  offenderType = this.lookupService.lookups.offenderType;
  decisionTypes = this.lookupService.lookups.decisionReportStatus;
  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Offender>();
  selectedTabIndex = 0;
  grievance$: Subject<PenaltyDecision> = new Subject<PenaltyDecision>();

  ngOnInit(): void {
    this.form = this.fb.group(new PenaltyDecisionCriteria().buildForm());
    this.listenToSearch();
    this.listenGrievance();
  }

  columnsWrapper: ColumnsWrapper<PenaltyDecision> = new ColumnsWrapper(
    new TextFilterColumn('decisionSerial'),
    new NoneFilterColumn('offenderInfo'),
    new NoneFilterColumn('decisionTypeInfo'),
    new NoneFilterColumn('penaltyInfo'),
    new NoneFilterColumn('signerInfo'),
    new NoneFilterColumn('statusInfo'),
    new NoneFilterColumn('actions'),
  );

  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  resetForm() {
    this.form.reset();
  }

  private listenToSearch() {
    this.search$
      .pipe(
        switchMap(() => {
          const result = this._beforeSearch();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(filter(value => value))
      .pipe(
        exhaustMap(() => {
          return this.offenderService.loadByCriteria(this.form.value).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe((data: Pagination<Offender[]>) => {
        if (data.rs.length) {
          this.selectedTabIndex = 2;
          this.displayedList = new MatTableDataSource(data.rs);
        } else {
          this.dialog.info(this.lang.map.no_records_to_display);
        }
      });
  }

  private listenGrievance() {
    this.grievance$
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(GrievancePopupComponent, {
              data: {
                model: model,
              },
            })
            .afterClosed();
        }),
      )
      .pipe(filter(click => click === UserClick.YES))
      .subscribe(() => {
        this.selectedTabIndex = 0;
      });
  }
}
