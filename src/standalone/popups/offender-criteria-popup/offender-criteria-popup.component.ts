import { OffenderViolationService } from '@services/offender-violation.service';
import { Violation } from '@models/violation';
import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { FormControl, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import { BehaviorSubject, combineLatest, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { LookupService } from '@services/lookup.service';
import { MawaredEmployeeCriteria } from '@models/mawared-employee-criteria';
import { ClearingAgentCriteria } from '@models/clearing-agent-criteria';
import { OffenderTypes } from '@enums/offender-types';
import { EmployeeService } from '@services/employee.service';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { ClearingAgentService } from '@services/clearing-agent.service';
import { AppTableDataSource } from '@models/app-table-data-source';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { ToastService } from '@services/toast.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ignoreErrors } from '@utils/utils';
import { CustomValidators } from '@validators/custom-validators';
import { OffenderViolation } from '@models/offender-violation';
import { Offender } from '@models/offender';
import { DialogService } from '@services/dialog.service';
import { InvestigationService } from '@services/investigation.service';
import { MawaredDepartment } from '@models/mawared-department';

@Component({
  selector: 'app-offender-criteria-popup',
  standalone: true,
  imports: [
    CommonModule,
    ButtonComponent,
    ControlDirective,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatDatepickerModule,
    MatDialogModule,
    ReactiveFormsModule,
    SelectInputComponent,
    TextareaComponent,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './offender-criteria-popup.component.html',
  styleUrls: ['./offender-criteria-popup.component.scss'],
})
export class OffenderCriteriaPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  data = inject(MAT_DIALOG_DATA);
  employeeService = inject(EmployeeService);
  offenderViolationService = inject(OffenderViolationService);
  fb = inject(UntypedFormBuilder);
  lang = inject(LangService);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  mawaredDepartmentsService = inject(MawaredDepartmentService);
  mawaredEmployeeService = inject(MawaredEmployeeService);
  service = inject(InvestigationService);
  clearingAgentService = inject(ClearingAgentService);
  depId = inject(EmployeeService).getOrganizationUnit()?.mawaredDepId;
  toast = inject(ToastService);
  search$: Subject<void> = new Subject();
  select$: Subject<void> = new Subject();
  addViolation$: Subject<void> = new Subject<void>();

  // lookups
  offenderTypes = this.lookupService.lookups.offenderType;
  administrations: MawaredDepartment[] = [];
  violations: Violation[] = [];
  offenders: Offender[] = this.data && ((this.data.offenders || []) as Offender[]);
  form!: UntypedFormGroup;
  isEmployee = true;
  isClearingAgent = false;
  offenderTypeControl = new FormControl(OffenderTypes.EMPLOYEE, { nonNullable: true });
  offenderViolationControl = new FormControl<number[]>([], [CustomValidators.required]);
  employeeFormGroup!: UntypedFormGroup;
  clearingAgentFormGroup!: UntypedFormGroup;
  employees$ = new BehaviorSubject<MawaredEmployee[]>([]);
  employeeDatasource = new AppTableDataSource(this.employees$);
  clearingAgents$ = new BehaviorSubject<ClearingAgent[]>([]);
  clearingAgentsDatasource = new AppTableDataSource(this.clearingAgents$);
  employeeDisplayedColumns = ['employee_number', 'arName', 'enName', 'department', 'qid', 'jobTitle', 'actions'];
  clearingAgentDisplayedColumns = ['clearingAgentCode', 'arName', 'enName', 'qid', 'companyName', 'companyNumber', 'actions'];
  addEmployee$: Subject<MawaredEmployee> = new Subject<MawaredEmployee>();
  addClearingAgent$: Subject<ClearingAgent> = new Subject<ClearingAgent>();
  @ViewChild(MatTabGroup)
  tabComponent!: MatTabGroup;

  ngOnInit(): void {
    this.employeeFormGroup = this.fb.group(new MawaredEmployeeCriteria().buildForm(true));
    this.clearingAgentFormGroup = this.fb.group(new ClearingAgentCriteria().buildForm(true));

    this.violations =
      this.data &&
      ((this.data.violations || []) as Violation[]).filter(
        v =>
          this.offenderTypeControl &&
          (v.offenderTypeInfo.lookupKey == this.offenderTypeControl?.value || v.offenderTypeInfo.lookupKey == OffenderTypes.BOTH)
      );

    this.employeeFormGroup.patchValue({
      employeeDepartmentId: this.depId,
    });

    this.listenToOffenderTypeChange();
    this.loadDepartments();
    this.listenToSearch();

    this.listenToAddEmployee();
    this.listenToAddClearingAgent();
    this.listenToAddViolation();
  }

  private listenToOffenderTypeChange() {
    this.offenderTypeControl.valueChanges.subscribe(value => {
      this.isEmployee = value === OffenderTypes.EMPLOYEE;
      this.isClearingAgent = value === OffenderTypes.ClEARING_AGENT;
      this.offenderViolationControl.reset();
      this.violations =
        this.data &&
        ((this.data.violations || []) as Violation[]).filter(
          v => this.offenderTypeControl && v.offenderTypeInfo.lookupKey == this.offenderTypeControl?.value
        );
    });
  }

  private loadDepartments(): void {
    this.mawaredDepartmentsService
      .loadUserDepartments()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.administrations = list;
      });
  }

  private listenToAddViolation() {
    this.addViolation$
      .pipe(takeUntil(this.destroy$))
      .pipe(switchMap(() => this.service.openAddViolation(this.data.caseId as string, new Subject()).afterClosed()))
      .subscribe((violation: Violation) => {
        (this.data.violations as Violation[]).unshift(new Violation().clone<Violation>({ ...violation }));
        this.offenderViolationControl.patchValue(
          this.offenderViolationControl.value ? [...this.offenderViolationControl.value, violation.id] : [violation.id]
        );
      });
  }

  private listenToSearch() {
    const mawaredSearch$ = this.search$
      .pipe(filter(() => !!this.offenderViolationControl?.value?.length && this.isEmployee))
      .pipe(takeUntil(this.destroy$));
    const clearingAgentSearch$ = this.search$
      .pipe(filter(() => !!this.offenderViolationControl?.value?.length && this.isClearingAgent))
      .pipe(takeUntil(this.destroy$));

    mawaredSearch$
      .pipe(
        map(() => this.employeeFormGroup.getRawValue()),
        switchMap(value => this.mawaredEmployeeService.load(undefined, value))
      )
      .pipe(
        map(pagination =>
          pagination.rs.filter(
            emp => !this.offenders.find((offender: Offender) => offender.offenderRefId == emp.id && offender.type == OffenderTypes.EMPLOYEE)
          )
        )
      )
      .subscribe(result => {
        if (result.length) {
          this.tabComponent.selectedIndex = 1;
        } else {
          this.dialog.warning(this.lang.map.no_records_to_display);
        }
        this.employees$.next(result);
      });

    clearingAgentSearch$
      .pipe(
        map(() => this.clearingAgentFormGroup.getRawValue()),
        switchMap(value => this.clearingAgentService.load(undefined, value))
      )
      .pipe(
        map(pagination =>
          pagination.rs.filter(
            emp => !this.offenders.find((offender: Offender) => offender.offenderRefId == emp.id && offender.type == OffenderTypes.ClEARING_AGENT)
          )
        )
      )
      .subscribe(result => {
        if (result.length) {
          this.tabComponent.selectedIndex = 1;
        } else {
          this.dialog.warning(this.lang.map.no_records_to_display);
        }
        this.clearingAgents$.next(result);
      });
  }

  private listenToAddEmployee() {
    this.addEmployee$
      .pipe(map(model => model.convertToOffender(this.data.caseId)))
      .pipe(
        switchMap(offender => {
          return offender.save();
        })
      )
      .pipe(
        switchMap((model: Offender) => {
          return combineLatest(
            (this.offenderViolationControl?.value || []).map((violationId: number) => {
              return this.offenderViolationService.create(
                new OffenderViolation().clone<OffenderViolation>({
                  caseId: this.data.caseId,
                  offenderId: model.id,
                  violationId: violationId,
                  status: 1,
                  isProved: true,
                })
              );
            })
          )
            .pipe(ignoreErrors())
            .pipe(map(() => model));
        })
      )
      .subscribe(model => {
        this.employeeDatasource.data.splice(
          this.employeeDatasource.data.findIndex(emp => emp.id == model.offenderRefId),
          1
        );
        if (this.employeeService.getEmployee()?.defaultOUId !== model?.offenderInfo?.employeeDepartmentId) {
          this.toast.info(this.lang.map.selected_offender_related_to_another_department);
        }
        this.employees$.next(this.employeeDatasource.data);
        this.toast.success(this.lang.map.msg_add_x_success.change({ x: model.getNames() }));
      });
  }

  private listenToAddClearingAgent() {
    this.addClearingAgent$
      .pipe(map(model => model.convertToOffender(this.data.caseId)))
      .pipe(
        switchMap(offender => {
          return offender.save();
        })
      )
      .pipe(
        switchMap((model: Offender) => {
          return combineLatest(
            (this.offenderViolationControl?.value || []).map((violationId: number) => {
              return this.offenderViolationService.create(
                new OffenderViolation().clone<OffenderViolation>({
                  caseId: this.data.caseId,
                  offenderId: model.id,
                  violationId: violationId,
                  status: 1,
                  isProved: true,
                })
              );
            })
          )
            .pipe(ignoreErrors())
            .pipe(map(() => model));
        })
      )
      .subscribe(model => {
        this.clearingAgentsDatasource.data.splice(
          this.clearingAgentsDatasource.data.findIndex(emp => emp.id == model.offenderRefId),
          1
        );
        this.clearingAgents$.next(this.clearingAgentsDatasource.data);
        this.toast.success(this.lang.map.msg_add_x_success.change({ x: model.getNames() }));
      });
  }
}
