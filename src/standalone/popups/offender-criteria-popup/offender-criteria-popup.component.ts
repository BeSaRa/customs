import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import { filter, map, Subject, switchMap, takeUntil } from 'rxjs';
import { LookupService } from '@services/lookup.service';
import { MawaredEmployeeCriteria } from '@models/mawared-employee-criteria';
import { BrokerCriteria } from '@models/broker-criteria';
import { OffenderTypes } from '@enums/offender-types';
import { EmployeeService } from '@services/employee.service';
import { MawaredDepartmentService } from '@services/mawared-department.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { BrokerService } from '@services/broker.service';

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
  ],
  templateUrl: './offender-criteria-popup.component.html',
  styleUrls: ['./offender-criteria-popup.component.scss'],
})
export class OffenderCriteriaPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
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

  ngOnInit(): void {
    this.employeeFormGroup = this.fb.group(new MawaredEmployeeCriteria().buildForm(true));
    this.brokerFormGroup = this.fb.group(new BrokerCriteria().buildForm(true));

    this.employeeFormGroup.patchValue({
      employeeDepartmentId: this.depId,
    });

    this.listenToOffenderTypeChange();
    this.loadDepartments();
    this.listenToSearch();
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
    const brokerSearch$ = this.search$.pipe(filter(() => this.isEmployee)).pipe(takeUntil(this.destroy$));

    mawaredSearch$
      .pipe(
        map(() => {
          return this.employeeFormGroup.getRawValue();
        }),
        switchMap(value => {
          return this.mawaredEmployeeService.load(undefined, value);
        })
      )
      .subscribe(result => {
        console.log(result);
      });
  }
}
