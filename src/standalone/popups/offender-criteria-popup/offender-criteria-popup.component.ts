import { Component, inject, OnInit } from '@angular/core';
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
import { BehaviorSubject, filter, map, Subject, switchMap, takeUntil } from 'rxjs';
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
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { ToastService } from '@services/toast.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ignoreErrors } from '@utils/utils';

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
  fb = inject(UntypedFormBuilder);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  search$: Subject<void> = new Subject();
  select$: Subject<void> = new Subject();
  mawaredDepartmentsService = inject(MawaredDepartmentService);
  mawaredEmployeeService = inject(MawaredEmployeeService);
  brokerService = inject(BrokerService);
  // lookups
  offenderTypes = this.lookupService.lookups.offenderType;
  administrations: unknown[] = [];
  form!: UntypedFormGroup;
  isEmployee = true;
  isBroker = false;
  control = new FormControl(OffenderTypes.EMPLOYEE, { nonNullable: true });
  depId = inject(EmployeeService).getOrganizationUnit()?.mawaredDepId;
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
  toast = inject(ToastService);

  tabIndex = 0;

  ngOnInit(): void {
    this.employeeFormGroup = this.fb.group(new MawaredEmployeeCriteria().buildForm(true));
    this.brokerFormGroup = this.fb.group(new BrokerCriteria().buildForm(true));

    this.employeeFormGroup.patchValue({
      employeeDepartmentId: this.depId,
    });

    this.listenToOffenderTypeChange();
    this.loadDepartments();
    this.listenToSearch();

    this.listenToAddEmployee();
    this.listenToAddBroker();
  }

  private listenToOffenderTypeChange() {
    this.control.valueChanges.subscribe(value => {
      this.isEmployee = value === OffenderTypes.EMPLOYEE;
      this.isBroker = value === OffenderTypes.BROKER;
    });
  }

  private loadDepartments(): void {
    this.mawaredDepartmentsService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.administrations = list;
      });
  }

  private listenToSearch() {
    const mawaredSearch$ = this.search$.pipe(filter(() => this.isEmployee)).pipe(takeUntil(this.destroy$));
    const brokerSearch$ = this.search$.pipe(filter(() => this.isBroker)).pipe(takeUntil(this.destroy$));

    mawaredSearch$
      .pipe(
        map(() => this.employeeFormGroup.getRawValue()),
        switchMap(value => this.mawaredEmployeeService.load(undefined, value))
      )
      .pipe(map(pagination => pagination.rs))
      .subscribe(result => {
        if (result.length) {
          this.tabIndex = 1;
        }
        this.employees$.next(result);
      });

    brokerSearch$
      .pipe(
        map(() => this.brokerFormGroup.getRawValue()),
        switchMap(value => this.brokerService.load(undefined, value))
      )
      .pipe(map(pagination => pagination.rs))
      .subscribe(result => {
        if (result.length) {
          this.tabIndex = 1;
        }
        this.brokers$.next(result);
      });
  }

  private listenToAddEmployee() {
    this.addEmployee$
      .pipe(map(model => model.convertToOffender(this.data.caseId)))
      .pipe(
        switchMap(offender => {
          return offender
            .save()
            .pipe(
              map(model => {
                return {
                  ...model,
                  ...offender,
                  id: model.id,
                };
              })
            )
            .pipe(ignoreErrors())
            .pipe(map(() => offender));
        })
      )
      .subscribe(model => {
        this.toast.success(this.lang.map.msg_add_x_success.change({ x: model.getNames() }));
      });
  }

  private listenToAddBroker() {
    this.addBroker$
      .pipe(map(model => model.convertToOffender(this.data.caseId)))
      .pipe(
        switchMap(offender => {
          return offender
            .save()
            .pipe(
              map(model => {
                return {
                  ...model,
                  ...offender,
                  id: model.id,
                };
              })
            )
            .pipe(ignoreErrors())
            .pipe(map(() => offender));
        })
      )
      .subscribe(model => {
        this.toast.success(this.lang.map.msg_add_x_success.change({ x: model.getNames() }));
      });
  }
}
