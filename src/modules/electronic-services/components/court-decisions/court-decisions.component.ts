import { Component, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { UserClick } from '@enums/user-click';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { Offender } from '@models/offender';
import { Pagination } from '@models/pagination';
import { PenaltyDecision } from '@models/penalty-decision';
import { PenaltyDecisionCriteria } from '@models/penalty-decision-criteria';
import { TextFilterColumn } from '@models/text-filter-column';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { OffenderService } from '@services/offender.service';
import { CourtDecisionPopupComponent } from '@standalone/popups/court-decision-popup/court-decision-popup.component';
import { ignoreErrors } from '@utils/utils';
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

@Component({
  selector: 'app-court-decisions',
  templateUrl: './court-decisions.component.html',
  styleUrl: './court-decisions.component.scss',
})
export class CourtDecisionsComponent implements OnInit {
  offenderService = inject(OffenderService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);

  offenderType = this.lookupService.lookups.offenderType;
  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Offender>();
  selectedTabIndex = 0;

  columnsWrapper: ColumnsWrapper<PenaltyDecision> = new ColumnsWrapper(
    new TextFilterColumn('decisionSerial'),
    new NoneFilterColumn('offenderInfo'),
    new NoneFilterColumn('penaltyInfo'),
    new NoneFilterColumn('signerInfo'),
    new NoneFilterColumn('statusInfo'),
    new NoneFilterColumn('actions'),
  );

  ngOnInit(): void {
    this.form = this.fb.group(new PenaltyDecisionCriteria().buildForm());
    this.listenToSearch();
  }

  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  resetForm() {
    this.form.reset();
  }

  listenToSearch() {
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
          this.selectedTabIndex = 1;
          this.displayedList = new MatTableDataSource(data.rs);
        } else {
          this.dialog.info(this.lang.map.no_records_to_display);
        }
      });
  }

  openCourtDecisionPopup(offender: Offender) {
    return this.dialog
      .open(CourtDecisionPopupComponent, {
        data: {
          model: offender,
        },
      })
      .afterClosed()
      .pipe(filter(click => click === UserClick.YES))
      .subscribe(() => {
        // this.selectedTabIndex = 0;
      });
  }
}
