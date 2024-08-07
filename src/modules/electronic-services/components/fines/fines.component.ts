import { Component, HostListener, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LookupService } from '@services/lookup.service';
import { DialogService } from '@services/dialog.service';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
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
import { MatTableDataSource } from '@angular/material/table';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { ignoreErrors } from '@utils/utils';
import { Fine } from '@models/Fine';
import { OfflinePaymentService } from '@services/offline-payment.service';
import { FineSearchCriteria } from '@models/fine-search-criteria';
import { TextFilterColumn } from '@models/text-filter-column';
import { map } from 'rxjs/operators';
import { ViewAttachmentPopupComponent } from '@standalone/popups/view-attachment-popup/view-attachment-popup.component';
import { AddPaymentPopupComponent } from '@standalone/popups/add-payment-popup/add-payment-popup.component';
import { Config } from '@constants/config';
import { ClearingAgent } from '@models/clearing-agent';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { ClearingAgency } from '@models/clearing-agency';
import { ClearingAgencyService } from '@services/clearing-agency.service';

@Component({
  selector: 'app-fines',
  templateUrl: './fines.component.html',
  styleUrl: './fines.component.scss',
})
export class FinesComponent implements OnInit {
  offlinePaymentService = inject(OfflinePaymentService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);
  clearingAgentService = inject(ClearingAgentService);
  clearingAgencyService = inject(ClearingAgencyService);
  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Fine>();
  selectedTab = 0;
  view$: Subject<Fine> = new Subject();
  pay$: Subject<Fine> = new Subject();
  config = Config;
  clearingAgents!: ClearingAgent[];
  clearingAgencies!: ClearingAgency[];
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search$.next();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group(new FineSearchCriteria().buildForm());
    this.listenToSearch();
    this.listenToViewDoc();
    this.listenToPay();
    this.loadClearingAgents();
    this.loadClearingAgencies();
  }

  loadClearingAgents() {
    this.clearingAgentService
      .loadAsLookups()
      .subscribe(clearingAgents => (this.clearingAgents = clearingAgents));
  }

  loadClearingAgencies() {
    this.clearingAgencyService
      .loadAsLookups()
      .subscribe(
        clearingAgencies => (this.clearingAgencies = clearingAgencies),
      );
  }

  columnsWrapper: ColumnsWrapper<Fine> = new ColumnsWrapper(
    new TextFilterColumn('qId'),
    new TextFilterColumn('agentName'),
    new TextFilterColumn('agencyName'),
    new TextFilterColumn('agencyNumber'),
    new TextFilterColumn('investigationFileNumber'),
    new TextFilterColumn('penaltyDecisionNumber'),
    new TextFilterColumn('penaltyDecisionDate'),
    new TextFilterColumn('penaltyAmount'),
    new NoneFilterColumn('status'),
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
          return this.offlinePaymentService.fetch(this.form.value).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe((data: Fine[]) => {
        if (data.length) {
          this.selectedTab = 1;
          this.displayedList = new MatTableDataSource(data);
        } else {
          this.dialog.info(this.lang.map.no_records_to_display);
        }
      });
  }

  private listenToViewDoc() {
    this.view$
      .pipe(
        switchMap(fine => {
          return this.offlinePaymentService
            .downloadDocumentById(fine.paymentDocId)
            .pipe(
              map(blob => {
                return {
                  fine,
                  blob,
                };
              }),
            );
        }),
        map(({ fine, blob }) => {
          return this.dialog.open(ViewAttachmentPopupComponent, {
            disableClose: true,
            data: {
              model: blob,
              title:
                fine.investigationFileNumber + '_' + fine.penaltyDecisionNumber,
            },
          });
        }),
      )
      .subscribe();
  }

  private listenToPay() {
    this.pay$
      .pipe(
        switchMap(fine => {
          return this.dialog
            .open(AddPaymentPopupComponent, {
              data: {
                fine,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.search$.next();
      });
  }
}
