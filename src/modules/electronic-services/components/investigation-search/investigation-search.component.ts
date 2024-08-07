import { DatePipe } from '@angular/common';
import { Component, HostListener, inject, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OpenFrom } from '@enums/open-from';
import { ClearingAgent } from '@models/clearing-agent';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Investigation } from '@models/investigation';
import { InvestigationSearchCriteria } from '@models/Investigation-search-criteria';
import { MawaredEmployee } from '@models/mawared-employee';
import { NoneFilterColumn } from '@models/none-filter-column';
import { OrganizationUnit } from '@models/organization-unit';
import { Penalty } from '@models/penalty';
import { ViolationType } from '@models/violation-type';
import { ActionsOnCaseComponent } from '@modules/electronic-services/components/actions-on-case/actions-on-case.component';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { EncryptionService } from '@services/encryption.service';
import { InvestigationSearchService } from '@services/investigation-search.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { PenaltyService } from '@services/penalty.service';
import { ViolationTypeService } from '@services/violation-type.service';
import {
  BehaviorSubject,
  combineLatest,
  delay,
  filter,
  isObservable,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-investigation-search',
  templateUrl: './investigation-search.component.html',
  styleUrls: ['./investigation-search.component.scss'],
  providers: [DatePipe],
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
  datePipe = inject(DatePipe);

  securityLevels = this.lookupService.lookups.securityLevelsWithAll;
  departments!: OrganizationUnit[];
  offenderTypes = this.lookupService.lookups.offenderTypeWithNone;
  caseStatus = this.lookupService.lookups.commonCaseStatus;
  violations!: ViolationType[];
  penalties!: Penalty[];
  mawaredEmployees!: MawaredEmployee[];
  clearingAgents!: ClearingAgent[];
  penaltyService = inject(PenaltyService);
  violationTypeService = inject(ViolationTypeService);
  mawaredEmployeeService = inject(MawaredEmployeeService);
  clearingAgentService = inject(ClearingAgentService);
  departmentService = inject(OrganizationUnitService);
  employeeService = inject(EmployeeService);
  form!: UntypedFormGroup;
  search$: Subject<void> = new Subject();
  displayedList = new MatTableDataSource<Investigation>();
  selectedTab = 0;
  today = new Date();
  public paginate$ = new BehaviorSubject({
    offset: 0,
    limit: 50,
  });
  length = 50;

  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search$.next();
    }
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.loadPenalties();
    this.loadViolationTypes();
    this.loadMawaredEmployees();
    this.loadClearingAgents();
    this.form = this.fb.group(
      new InvestigationSearchCriteria().buildForm(true),
    );
    this.form
      .get('createdFrom')
      ?.setValue(new Date(new Date().getFullYear(), 0, 1));
    this.form.get('createdTo')?.setValue(this.today);
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

  private _prepareModel() {
    if (
      this.form.get('createdFrom')?.value &&
      this.form.get('createdTo')?.value
    ) {
      this.form
        .get('createdFrom')
        ?.setValue(
          this.datePipe.transform(
            new Date(this.form.get('createdFrom')?.value),
            'yyyy-MM-dd',
          ),
        );
      this.form
        .get('createdTo')
        ?.setValue(
          this.datePipe.transform(
            new Date(this.form.get('createdTo')?.value),
            'yyyy-MM-dd',
          ),
        );
    }
    return this.form.value;
  }

  resetForm() {
    this.form.reset();
  }

  private listenToSearch() {
    this.search$
      .pipe(delay(0))
      .pipe(
        switchMap(() => {
          const result = this._beforeSearch();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(filter(value => value))
      .pipe(
        switchMap(() => {
          const result = this._prepareModel();
          return isObservable(result) ? result : of(result);
        }),
      )
      .pipe(
        switchMap(() => {
          return combineLatest([this.paginate$]).pipe(
            switchMap(([paginationOptions]) => {
              const criteria = {
                ...this.form.value,
                ...paginationOptions,
              };
              return this.investigationSearchService.search(criteria);
            }),
            tap(({ count }) => {
              this.length = count;
            }),
            map(response => response.rs),
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
      taskId: item.caseId,
      caseId: item.caseId,
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
      data: { caseId: item.caseId },
    });
  }

  loadDepartments() {
    this.departmentService.loadAsLookups().subscribe(departments => {
      this.departments = departments;
      const userOU = this.employeeService.getOrganizationUnit();
      if (userOU) {
        this.form.get('departmentId')?.setValue(userOU.id);
      }
    });
  }

  loadPenalties() {
    this.penaltyService
      .loadAsLookups()
      .subscribe(penalties => (this.penalties = penalties));
  }

  loadViolationTypes() {
    this.violationTypeService
      .loadAsLookups()
      .subscribe(violations => (this.violations = violations));
  }

  loadMawaredEmployees() {
    this.mawaredEmployeeService
      .loadAsLookups()
      .subscribe(
        mawaredEmployees => (this.mawaredEmployees = mawaredEmployees),
      );
  }

  loadClearingAgents() {
    this.clearingAgentService
      .loadAsLookups()
      .subscribe(clearingAgents => (this.clearingAgents = clearingAgents));
  }

  paginate($event: PageEvent) {
    this.paginate$.next({
      offset: $event.pageSize * $event.pageIndex,
      limit: $event.pageSize,
    });
  }

  get limit(): number {
    return this.paginate$.value.limit;
  }

  getDepartments() {
    if (this.employeeService.hasPermissionTo('SEARCH_IN_ALL_DEPARTMENT')) {
      return this.departments;
    } else if (this.employeeService.hasPermissionTo('SEARCH_IN_DEPARTMENT')) {
      return this.departments.filter(
        d =>
          this.employeeService.getOrganizationUnit()?.id === d.id ||
          this.employeeService.getOrganizationUnit()?.id === d.parent,
      );
    } else {
      return this.employeeService.getOrganizationUnits();
    }
  }
}
