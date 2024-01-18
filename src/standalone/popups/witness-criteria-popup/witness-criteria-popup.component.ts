import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import {
  BehaviorSubject,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { LookupService } from '@services/lookup.service';
import { MawaredEmployeeCriteria } from '@models/mawared-employee-criteria';
import { ClearingAgentCriteria } from '@models/clearing-agent-criteria';
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
import { WitnessTypes } from '@enums/witness-types';
import { Witness } from '@models/witness';
import { PersonTypes } from '@enums/person-types';

@Component({
  selector: 'app-witness-criteria-popup',
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
  templateUrl: './witness-criteria-popup.component.html',
  styleUrls: ['./witness-criteria-popup.component.scss'],
})
export class WitnessCriteriaPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  employeeService = inject(EmployeeService);
  fb = inject(UntypedFormBuilder);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  matDialogRef = inject(MatDialogRef);
  search$: Subject<void> = new Subject();
  addWitness$: Subject<void> = new Subject();
  mawaredDepartmentsService = inject(MawaredDepartmentService);
  mawaredEmployeeService = inject(MawaredEmployeeService);
  clearingAgentService = inject(ClearingAgentService);
  // lookups
  personTypes = this.lookupService.lookups.personType;
  witnessTypes = this.lookupService.lookups.witnessType;
  administrations: unknown[] = [];
  form!: UntypedFormGroup;
  isEmployee = true;
  isClearingAgent = false;
  isExternal = false;
  witnessTypeControl = new FormControl(WitnessTypes.EMPLOYEE, {
    nonNullable: true,
  });
  personTypeControl = new FormControl(PersonTypes.EXPERT, {
    nonNullable: true,
  });
  depId = inject(EmployeeService).getOrganizationUnit()?.mawaredDepId;
  witnessFormGroup!: UntypedFormGroup;
  employeeFormGroup!: UntypedFormGroup;
  clearingAgentFormGroup!: UntypedFormGroup;
  employees$ = new BehaviorSubject<MawaredEmployee[]>([]);
  employeeDatasource = new AppTableDataSource(this.employees$);
  clearingAgents$ = new BehaviorSubject<ClearingAgent[]>([]);
  clearingAgentsDatasource = new AppTableDataSource(this.clearingAgents$);
  employeeDisplayedColumns = [
    'employee_number',
    'arName',
    'enName',
    'department',
    'qid',
    'jobTitle',
    'actions',
  ];
  clearingAgentDisplayedColumns = [
    'clearingAgentCode',
    'arName',
    'enName',
    'qid',
    'companyName',
    'companyNumber',
    'actions',
  ];
  addEmployee$: Subject<MawaredEmployee> = new Subject<MawaredEmployee>();
  addClearingAgent$: Subject<ClearingAgent> = new Subject<ClearingAgent>();
  toast = inject(ToastService);
  @ViewChild(MatTabGroup)
  tabComponent!: MatTabGroup;

  ngOnInit(): void {
    this.witnessFormGroup = this.fb.group(new Witness().buildForm(true));
    this.employeeFormGroup = this.fb.group(
      new MawaredEmployeeCriteria().buildForm(true),
    );
    this.clearingAgentFormGroup = this.fb.group(
      new ClearingAgentCriteria().buildForm(true),
    );

    this.employeeFormGroup.patchValue({
      employeeDepartmentId: this.depId,
    });

    this.listenToWitnessTypeChange();
    this.loadDepartments();
    this.listenToSearch();
    this.listenToAddWitness();

    this.listenToAddEmployee();
    this.listenToAddClearingAgent();
  }

  private listenToWitnessTypeChange() {
    this.witnessTypeControl.valueChanges.subscribe((value) => {
      this.isEmployee = value === WitnessTypes.EMPLOYEE;
      this.isClearingAgent = value === WitnessTypes.ClEARING_AGENT;
      this.isExternal = value === WitnessTypes.EXTERNAL;
    });
  }

  private loadDepartments(): void {
    this.mawaredDepartmentsService
      .loadAsLookups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((list) => {
        this.administrations = list;
      });
  }

  private listenToSearch() {
    const mawaredSearch$ = this.search$
      .pipe(filter(() => this.isEmployee))
      .pipe(takeUntil(this.destroy$));
    const clearingAgentSearch$ = this.search$
      .pipe(filter(() => this.isClearingAgent))
      .pipe(takeUntil(this.destroy$));

    mawaredSearch$
      .pipe(
        map(() => this.employeeFormGroup.getRawValue()),
        switchMap((value) =>
          this.mawaredEmployeeService.load(undefined, value),
        ),
      )
      .pipe(map((pagination) => pagination.rs))
      .subscribe((result) => {
        if (result.length) {
          this.tabComponent.selectedIndex = 1;
        }
        this.employees$.next(result);
      });

    clearingAgentSearch$
      .pipe(
        map(() => this.clearingAgentFormGroup.getRawValue()),
        switchMap((value) => this.clearingAgentService.load(undefined, value)),
      )
      .pipe(map((pagination) => pagination.rs))
      .subscribe((result) => {
        if (result.length) {
          this.tabComponent.selectedIndex = 1;
        }
        this.clearingAgents$.next(result);
      });
  }
  private listenToAddWitness() {
    this.addWitness$
      .pipe(
        map(() =>
          new Witness().clone<Witness>({
            ...this.witnessFormGroup.value,
            caseId: this.data.caseId,
            personType: this.personTypeControl.value,
            witnessType: WitnessTypes.EXTERNAL,
            status: 1,
          }),
        ),
      )
      .pipe(
        switchMap((witness) => {
          return witness
            .save()
            .pipe(
              map((model) => {
                return {
                  ...model,
                  ...witness,
                  id: model.id,
                };
              }),
            )
            .pipe(ignoreErrors())
            .pipe(map(() => witness));
        }),
      )
      .subscribe((model) => {
        this.toast.success(
          this.lang.map.msg_add_x_success.change({ x: model.getNames() }),
        );
        this.matDialogRef.close();
      });
  }
  private listenToAddEmployee() {
    this.addEmployee$
      .pipe(
        map((model) =>
          model.convertToWitness(
            this.data.caseId,
            this.personTypeControl.value,
          ),
        ),
      )
      .pipe(
        switchMap((witness) => {
          return witness
            .save()
            .pipe(
              map((model) => {
                return {
                  ...model,
                  ...witness,
                  id: model.id,
                };
              }),
            )
            .pipe(ignoreErrors())
            .pipe(map(() => witness));
        }),
      )
      .subscribe((model) => {
        this.toast.success(
          this.lang.map.msg_add_x_success.change({ x: model.getNames() }),
        );
      });
  }

  private listenToAddClearingAgent() {
    this.addClearingAgent$
      .pipe(
        map((model) =>
          model.convertToWitness(
            this.data.caseId,
            this.personTypeControl.value,
          ),
        ),
      )
      .pipe(
        switchMap((witness) => {
          return witness
            .save()
            .pipe(
              map((model) => {
                return {
                  ...model,
                  ...witness,
                  id: model.id,
                };
              }),
            )
            .pipe(ignoreErrors())
            .pipe(map(() => witness));
        }),
      )
      .subscribe((model) => {
        this.toast.success(
          this.lang.map.msg_add_x_success.change({ x: model.getNames() }),
        );
      });
  }
}
