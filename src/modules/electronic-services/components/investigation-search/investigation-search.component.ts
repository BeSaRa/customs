import { Component, inject } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Investigation } from '@models/investigation';
import { NoneFilterColumn } from '@models/none-filter-column';
import { InvestigationSearchService } from '@services/investigation-search.service';
import { InvestigationService } from '@services/investigation.service';
import { LangService } from '@services/lang.service';
import { ignoreErrors } from '@utils/utils';
import { Observable, Subject, catchError, exhaustMap, filter, isObservable, of, switchMap, throwError } from 'rxjs';

@Component({
  selector: 'app-investigation-search',
  templateUrl: './investigation-search.component.html',
  styleUrls: ['./investigation-search.component.scss'],
})
export class InvestigationSearchComponent {
  investigationService = inject(InvestigationService);
  investigationSearchService = inject(InvestigationSearchService);

  lang = inject(LangService);
  fb = inject(UntypedFormBuilder);

  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Investigation>();
  selectedTab = 0;

  ngOnInit(): void {
    this.form = this.fb.group(new Investigation().buildForm());
    this.listenToSearch();
  }

  actions: ContextMenuActionContract<Investigation>[] = [
    {
      name: 'more-details',
      type: 'action',
      label: 'more_details',
      icon: AppIcons.INFORMATION,
      callback: item => {},
    },
  ];
  columnsWrapper: ColumnsWrapper<Investigation> = new ColumnsWrapper(
    new NoneFilterColumn('draftFullSerial'),
    new NoneFilterColumn('caseStatus'),
    new NoneFilterColumn('limitedAccess'),
    new NoneFilterColumn('creator'),
    new NoneFilterColumn('department')
  );

  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
  callback() {}
  resetForm() {
    this.form.reset();
  }

  private listenToSearch() {
    this.search$
      .pipe(
        switchMap(() => {
          const result = this._beforeSearch();
          return isObservable(result) ? result : of(result);
        })
      )
      .pipe(filter(value => value))
      .pipe(
        exhaustMap(() => {
          return this.investigationSearchService.search(this.form.value).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe((data: Investigation[]) => {
        console.log(data);

        if (data.length) {
          this.selectedTab = 1;
        }
        console.log(this.selectedTab);

        this.displayedList = new MatTableDataSource(data);
        console.log(this.displayedList);
      });
  }

  getSecurityLevel(limitedAccess: boolean): string {
    return this.lang.map[limitedAccess as unknown as 'true' | 'false'];
  }
}
