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
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { OffenderTypeWithNone } from '@enums/offender-type-with-none';
import { OpenFrom } from '@enums/open-from';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Investigation } from '@models/investigation';
import { InvestigationSearchCriteria } from '@models/Investigation-search-criteria';
import { NoneFilterColumn } from '@models/none-filter-column';
import { OrganizationUnit } from '@models/organization-unit';
import { ActionsOnCaseComponent } from '@modules/electronic-services/components/actions-on-case/actions-on-case.component';
import { ConfigService } from '@services/config.service';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { EncryptionService } from '@services/encryption.service';
import { InvestigationSearchService } from '@services/investigation-search.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { range } from '@utils/utils';
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
import { Config } from '@constants/config';
import { OffenderViolation } from '@models/offender-violation';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { ClassificationTypes } from '@enums/violation-classification';
import { AdminResult } from '@models/admin-result';
import { OffenderTypes } from '@enums/offender-types';

@Component({
  selector: 'app-investigation-search',
  templateUrl: './investigation-search.component.html',
  styleUrls: ['./investigation-search.component.scss'],
  providers: [DatePipe],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
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
  departmentService = inject(OrganizationUnitService);
  employeeService = inject(EmployeeService);
  config = inject(ConfigService);

  selectedOffender!: OffenderViolation | null;
  Config = Config;
  departments!: OrganizationUnit[];
  violationClassifications = this.lookupService.lookups.violationClassification;
  offenderTypes = this.lookupService.lookups.offenderTypeWithNone;
  statusList = this.lookupService.lookups.caseGeneralStatus;
  OffenderTypesEnum = OffenderTypes;
  years: string[] = range(
    new Date().getFullYear() - this.config.CONFIG.YEAR_RANGE_FROM_CURRENT_YEAR,
    new Date().getFullYear(),
  ).map(i => i.toString());
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
  offenderViolationInfo: Map<string, OffenderViolation[]> = new Map();
  @HostListener('document:keypress', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.search$.next();
    }
  }

  ngOnInit(): void {
    this.loadDepartments();
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
    new NoneFilterColumn('fullSerial'),
    new NoneFilterColumn('caseStatus'),
    new NoneFilterColumn('dateCreated'),
    new NoneFilterColumn('violationClassifications'),
    new NoneFilterColumn('actions'),
  );
  offenderDetailsDisplayedColumns = [
    'offenderType',
    'offenderName',
    'offenderNumber',
    'department/agency',
  ];
  showInvestigationViolationClassification(
    OffendersViolations: OffenderViolation[],
  ) {
    const map = new Map();
    OffendersViolations.forEach(offenderViolation => {
      if (!map.has(offenderViolation.violationInfo.classificationInfo.id)) {
        map.set(
          offenderViolation.violationInfo.classificationInfo.id,
          AdminResult.createInstance({
            ...offenderViolation.violationInfo.classificationInfo,
          }),
        );
      }
    });
    return map.values();
  }
  protected _beforeSearch(): boolean | Observable<boolean> {
    this.form.markAllAsTouched();
    return this.form.valid;
  }
  getOffenderNumberLabel(): keyof LangKeysContract {
    if (this.isEmployee) {
      return 'employee_number' as keyof LangKeysContract;
    } else if (this.isClearingAgent) {
      return 'clearing_agent_code' as keyof LangKeysContract;
    }
    return 'employee_clearing_agent_number' as keyof LangKeysContract;
  }
  get isEmployee() {
    return (
      this.form.getRawValue().offenderType === OffenderTypeWithNone.EMPLOYEE
    );
  }
  get isClearingAgent() {
    return this.form.getRawValue().offenderType === OffenderTypeWithNone.BROKER;
  }
  get isCustomsViolationClassification() {
    return (
      this.form.getRawValue().violationClassificationId ===
      ClassificationTypes.custom
    );
  }
  get isCriminalViolationClassification() {
    return (
      this.form.getRawValue().violationClassificationId ===
      ClassificationTypes.criminal
    );
  }
  filteredElements(Elements: OffenderViolation[]) {
    const map = new Map();
    return Elements.filter(elem => {
      if (map.has(elem.offenderId)) {
        return false;
      }
      map.set(elem.offenderId, true);
      return true;
    });
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

  rowClicked($event: MouseEvent, element: OffenderViolation) {
    const requiredClassToPreventExpended = 'mat-mdc-button-touch-target';
    if (
      !($event.target as unknown as HTMLElement).classList.contains(
        requiredClassToPreventExpended,
      )
    ) {
      this.selectedOffender =
        this.selectedOffender === element ? null : element;
    }
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
      .pipe(
        tap(data => {
          data.forEach(element => {
            this.offenderViolationInfo.set(element.caseId, [
              ...this.showInvestigationViolationClassification(
                element.offenderViolationInfo,
              ),
            ]);
          });
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
