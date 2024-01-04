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
import { BrokerCriteria } from '@models/broker-criteria';
import { OffenderTypes } from '@enums/offender-types';
import { EmployeeService } from '@services/employee.service';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { BrokerService } from '@services/broker.service';
import { AppTableDataSource } from '@models/app-table-data-source';
import { MawaredEmployee } from '@models/mawared-employee';
import { Broker } from '@models/broker';
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
  brokerService = inject(BrokerService);
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
  isBroker = false;
  offenderTypeControl = new FormControl(OffenderTypes.EMPLOYEE, { nonNullable: true });
  offenderViolationControl = new FormControl<number[]>([], [CustomValidators.required]);
  employeeFormGroup!: UntypedFormGroup;
  brokerFormGroup!: UntypedFormGroup;
  employees$ = new BehaviorSubject<MawaredEmployee[]>([]);
  employeeDatasource = new AppTableDataSource(this.employees$);
  brokers$ = new BehaviorSubject<Broker[]>([]);
  brokersDatasource = new AppTableDataSource(this.brokers$);
  employeeDisplayedColumns = ['employee_number', 'arName', 'enName', 'department', 'qid', 'jobTitle', 'actions'];
  brokerDisplayedColumns = ['brokerCode', 'arName', 'enName', 'qid', 'companyName', 'companyNumber', 'actions'];
  addEmployee$: Subject<MawaredEmployee> = new Subject<MawaredEmployee>();
  addBroker$: Subject<Broker> = new Subject<Broker>();
  @ViewChild(MatTabGroup)
  tabComponent!: MatTabGroup;

  ngOnInit(): void {
    this.employeeFormGroup = this.fb.group(new MawaredEmployeeCriteria().buildForm(true));
    this.brokerFormGroup = this.fb.group(new BrokerCriteria().buildForm(true));

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
    this.listenToAddBroker();
    this.listenToAddViolation();
  }

  private listenToOffenderTypeChange() {
    this.offenderTypeControl.valueChanges.subscribe(value => {
      this.isEmployee = value === OffenderTypes.EMPLOYEE;
      this.isBroker = value === OffenderTypes.BROKER;
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
    const brokerSearch$ = this.search$
      .pipe(filter(() => !!this.offenderViolationControl?.value?.length && this.isBroker))
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

    brokerSearch$
      .pipe(
        map(() => this.brokerFormGroup.getRawValue()),
        switchMap(value => this.brokerService.load(undefined, value))
      )
      .pipe(
        map(pagination =>
          pagination.rs.filter(
            emp => !this.offenders.find((offender: Offender) => offender.offenderRefId == emp.id && offender.type == OffenderTypes.BROKER)
          )
        )
      )
      .subscribe(result => {
        if (result.length) {
          this.tabComponent.selectedIndex = 1;
        } else {
          this.dialog.warning(this.lang.map.no_records_to_display);
        }
        this.brokers$.next(result);
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

  private listenToAddBroker() {
    this.addBroker$
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
        this.brokersDatasource.data.splice(
          this.brokersDatasource.data.findIndex(emp => emp.id == model.offenderRefId),
          1
        );
        this.brokers$.next(this.brokersDatasource.data);
        this.toast.success(this.lang.map.msg_add_x_success.change({ x: model.getNames() }));
      });
  }
}
