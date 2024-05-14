import { Component, HostListener, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Investigation } from '@models/investigation';
import { NoneFilterColumn } from '@models/none-filter-column';
import { InvestigationSearchService } from '@services/investigation-search.service';
import { LangService } from '@services/lang.service';
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
import { ActivatedRoute, Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { EncryptionService } from '@services/encryption.service';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OpenFrom } from '@enums/open-from';
import { LookupService } from '@services/lookup.service';
import { DialogService } from '@services/dialog.service';
import { ActionsOnCaseComponent } from '@modules/electronic-services/components/actions-on-case/actions-on-case.component';

@Component({
  selector: 'app-investigation-search',
  templateUrl: './investigation-search.component.html',
  styleUrls: ['./investigation-search.component.scss'],
})
export class InvestigationSearchComponent implements OnInit {
  investigationSearchService = inject(InvestigationSearchService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  encrypt = inject(EncryptionService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);

  securityLevels = this.lookupService.lookups.securityLevel;
  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Investigation>();
  selectedTab = 0;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.code === 'Enter') {
      this.search$.next();
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group(new Investigation().buildForm());
    this.listenToSearch();
    if (history.state.returnedFromInvestigation) {
      this.form.patchValue(history.state);
      this.search$.next();
    }
  }

  actions: ContextMenuActionContract<Investigation>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view(item);
      },
    },
  ];
  columnsWrapper: ColumnsWrapper<Investigation> = new ColumnsWrapper(
    new NoneFilterColumn('draftFullSerial'),
    new NoneFilterColumn('investigationFullSerial'),
    new NoneFilterColumn('caseStatus'),
    new NoneFilterColumn('securityLevel'),
    new NoneFilterColumn('department'),
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
          return this.investigationSearchService.search(this.form.value).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe((data: Investigation[]) => {
        if (data.length) {
          this.selectedTab = 1;
          this.displayedList = new MatTableDataSource(data);
        } else {
          this.dialog.info(this.lang.map.no_records_to_display);
        }
      });
  }

  view(item: Investigation) {
    const itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: OpenFrom.SEARCH,
      taskId: item.id,
      caseId: item.id,
      caseType: item.caseType,
      searchCriteria: this.form.value,
    });
    this.router
      .navigate([AppFullRoutes.INVESTIGATION], {
        queryParams: { item: itemDetails },
      })
      .then();
  }

  showActionsOnCase(item: Investigation) {
    this.dialog.open(ActionsOnCaseComponent, {
      data: { caseId: item.id },
    });
  }
}
