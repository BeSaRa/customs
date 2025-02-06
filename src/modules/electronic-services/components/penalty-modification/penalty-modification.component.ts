import { Component, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { FormBuilder, UntypedFormGroup } from '@angular/forms';
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
import { CustomValidators } from '@validators/custom-validators';
import { ignoreErrors } from '@utils/utils';
import { Offender } from '@models/offender';
import { MatTableDataSource } from '@angular/material/table';
import { OffenderService } from '@services/offender.service';
import { DialogService } from '@services/dialog.service';
import { OffenderTypes } from '@enums/offender-types';
import { Lookup } from '@models/lookup';
import { LookupService } from '@services/lookup.service';
import { InvestigationService } from '@services/investigation.service';

@Component({
  selector: 'app-penalty-modification',
  templateUrl: './penalty-modification.component.html',
  styleUrl: './penalty-modification.component.scss',
})
export class PenaltyModificationComponent implements OnInit {
  lang = inject(LangService);
  fb = inject(FormBuilder);
  offenderService = inject(OffenderService);
  investigationService = inject(InvestigationService);
  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  penaltyModification$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Offender>();
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  protected readonly offenderTypes = OffenderTypes;
  offenderTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.offenderType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {},
    );
  displayedColumns = [
    'offenderName',
    'offenderType',
    'qid',
    'departmentCompany',
    'actions',
  ];
  ngOnInit(): void {
    this.form = this.fb.group({
      decisionSerial: ['', CustomValidators.required],
    });
    this.listenToSearch();
    this.listenToPenaltyModification();
  }
  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
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
          return this.offenderService
            .loadDecisionSerial(this.form.get('decisionSerial')?.value)
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe((data: Offender) => {
        console.log(data);
        if (data) {
          this.displayedList = new MatTableDataSource([data]);
        } else {
          this.dialog.info(this.lang.map.no_records_to_display);
        }
      });
  }
  private listenToPenaltyModification() {
    this.penaltyModification$
      .pipe(
        exhaustMap(() => {
          return this.investigationService
            .requestPenaltyModification(this.form.get('decisionSerial')?.value)
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe(() => {
        this.dialog.success(
          this.lang.map.request_is_added_and_sent_to_group_mail,
        );
      });
  }
}
