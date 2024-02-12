import {
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
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
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
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
import { OffenderViolation } from '@models/offender-violation';
import { Offender } from '@models/offender';
import { DialogService } from '@services/dialog.service';
import { InvestigationService } from '@services/investigation.service';
import { MawaredDepartment } from '@models/mawared-department';
import { OffenderCriteriaDataContract } from '@contracts/offender-criteria-data-contract';
import { toSignal } from '@angular/core/rxjs-interop';
import { OffenderService } from '@services/offender.service';
import { ProofTypes } from '@enums/proof-types';
import { SituationSearchComponent } from '@modules/electronic-services/components/situation-search/situation-search.component';
import { OffenderViolationService } from '@services/offender-violation.service';

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
export class OffenderCriteriaPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject<OffenderCriteriaDataContract>(MAT_DIALOG_DATA);
  employeeService = inject(EmployeeService);
  // don't remove it we need it to make the model make save without any problems
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
  addViolation$: Subject<void> = new Subject<void>();
  model = this.data && this.data.model;
  // lookups
  offenderTypes = this.lookupService.lookups.offenderType;
  offenderTypesEnum = OffenderTypes;
  administrations: MawaredDepartment[] = [];
  offenders = computed(() => this.model().offenderInfo);
  form!: UntypedFormGroup;
  isEmployee = true;
  isClearingAgent = false;
  offenderTypeControl = new FormControl(OffenderTypes.EMPLOYEE, {
    nonNullable: false,
  });
  offenderViolationControl = new FormControl<number[]>([]);
  employeeFormGroup!: UntypedFormGroup;
  clearingAgentFormGroup!: UntypedFormGroup;
  employees$ = new BehaviorSubject<MawaredEmployee[]>([]);
  employeeDatasource = new AppTableDataSource(this.employees$);
  clearingAgents$ = new BehaviorSubject<ClearingAgent[]>([]);
  clearingAgentsDatasource = new AppTableDataSource(this.clearingAgents$);
  offenderService = inject(OffenderService);
  employeeDisplayedColumns = [
    'employee_number',
    'offenderName',
    'qid',
    'employeeCareerLevel',
    'department',
    'actions',
  ];
  clearingAgentDisplayedColumns = [
    'clearingAgentCode',
    'offenderName',
    'qid',
    'companyName',
    'companyNumber',
    'actions',
  ];
  addEmployee$: Subject<MawaredEmployee> = new Subject<MawaredEmployee>();
  addClearingAgent$: Subject<ClearingAgent> = new Subject<ClearingAgent>();
  situationSearch$ = new Subject<{
    offender: Offender;
    isCompany: boolean;
  }>();
  @ViewChild(MatTabGroup, { static: true })
  tabComponent!: MatTabGroup;
  selectedIndex: number = 0;
  linkOffenderWithViolation = this.data.linkOffenderWithViolation;
  reportType = this.data && this.data.reportType;
  offenderType = toSignal(this.offenderTypeControl.valueChanges, {
    initialValue: OffenderTypes.EMPLOYEE,
  });

  caseId = computed(() => this.model().id);

  canSave = computed(() => this.caseId());

  refresh = signal(true);

  violations = computed(() => {
    this.refresh();
    return this.model().violationInfo.filter(violation =>
      [this.offenderType(), OffenderTypes.BOTH].includes(
        violation.offenderTypeInfo.lookupKey,
      ),
    );
  });

  effectCanSaveRef = effect(() => {
    if (this.canSave()) {
      this.waitTillPendingSaveDone$.next();
    }
  });
  private waitTillPendingSaveDone$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.employeeFormGroup = this.fb.group(
      new MawaredEmployeeCriteria().buildForm(true),
    );
    this.clearingAgentFormGroup = this.fb.group(
      new ClearingAgentCriteria().buildForm(true),
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
    this.listenToSituationSearch();
  }

  private listenToOffenderTypeChange() {
    this.offenderTypeControl.valueChanges.subscribe(value => {
      this.isEmployee = value === OffenderTypes.EMPLOYEE;
      this.isClearingAgent = value === OffenderTypes.ClEARING_AGENT;
      this.offenderViolationControl.reset();
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
      .pipe(
        switchMap(() =>
          this.service
            .openAddViolation(
              this.model,
              this.data.askForSaveModel,
              this.reportType,
              this.model().violationInfo,
            )
            .afterClosed()
            .pipe(filter(result => !!result))
            .pipe(tap(() => this.data.askForViolationListReload.next())),
        ),
      )
      .subscribe(violation => {
        this.refresh.update(value => !value);
        if (
          violation.offenderTypeInfo?.lookupKey ===
          this.offenderTypeControl.value
        ) {
          this.offenderViolationControl.patchValue(
            this.offenderViolationControl.value
              ? [...this.offenderViolationControl.value, violation.id]
              : [violation.id],
          );
        }
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
        switchMap(value => this.mawaredEmployeeService.load(undefined, value)),
      )
      .pipe(
        map(pagination =>
          pagination.rs.filter(
            emp =>
              !this.offenders().find(
                (offender: Offender) =>
                  offender.offenderRefId === emp.id &&
                  offender.type === OffenderTypes.EMPLOYEE,
              ),
          ),
        ),
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
        switchMap(value => this.clearingAgentService.load(undefined, value)),
      )
      .pipe(
        map(pagination =>
          pagination.rs.filter(
            emp =>
              !this.offenders().find(
                (offender: Offender) =>
                  offender.offenderRefId === emp.id &&
                  offender.type === OffenderTypes.ClEARING_AGENT,
              ),
          ),
        ),
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

  addEmployee(employee: MawaredEmployee) {
    this.addEmployee$.next(employee);
  }

  private listenToAddEmployee() {
    this.addEmployee$
      .pipe(map(model => model.convertToOffender(this.caseId())))
      .pipe(switchMap(model => this.makeSureThatCaseIdExistsBeforeSave(model)))
      .pipe(
        switchMap(offender => {
          return offender.save().pipe(
            tap(offender => {
              this.model().offenderInfo = [
                ...this.model().offenderInfo,
                offender,
              ];
              this.data.offenderAdded.emit(offender);
            }),
          );
        }),
      )
      .pipe(
        switchMap((model: Offender) => {
          return combineLatest(this.addOffenderViolation(model))
            .pipe(ignoreErrors())
            .pipe(map(() => model));
        }),
      )
      .subscribe(model => {
        this.linkOffenderWithViolation.emit();
        this.employeeDatasource.data.splice(
          this.employeeDatasource.data.findIndex(
            emp => emp.id === model.offenderRefId,
          ),
          1,
        );

        if (
          this.offenderService.isEmployee(model.offenderInfo!) &&
          this.employeeService.getEmployee()?.defaultOUId !==
            model?.offenderInfo?.employeeDepartmentId
        ) {
          this.toast.info(
            this.lang.map.selected_offender_related_to_another_department,
          );
        }
        this.employees$.next(this.employeeDatasource.data);
        this.toast.success(
          this.lang.map.msg_add_x_success.change({ x: model.getNames() }),
        );
      });
  }

  addClearingAgent(agent: ClearingAgent) {
    this.addClearingAgent$.next(agent);
  }

  private listenToAddClearingAgent() {
    this.addClearingAgent$
      .pipe(map(model => model.convertToOffender(this.caseId())))
      .pipe(switchMap(model => this.makeSureThatCaseIdExistsBeforeSave(model)))
      .pipe(
        switchMap(offender => {
          return offender.save().pipe(
            tap(offender => {
              this.model().offenderInfo = [
                ...this.model().offenderInfo,
                offender,
              ];
              this.data.offenderAdded.emit(offender);
            }),
          );
        }),
      )
      .pipe(
        switchMap((model: Offender) => {
          return combineLatest(this.addOffenderViolation(model))
            .pipe(ignoreErrors())
            .pipe(map(() => model));
        }),
      )
      .subscribe(model => {
        this.linkOffenderWithViolation.emit();
        this.clearingAgentsDatasource.data.splice(
          this.clearingAgentsDatasource.data.findIndex(
            emp => emp.id === model.offenderRefId,
          ),
          1,
        );
        this.clearingAgents$.next(this.clearingAgentsDatasource.data);
        this.toast.success(
          this.lang.map.msg_add_x_success.change({ x: model.getNames() }),
        );
      });
  }

  addOffenderViolation(model: Offender): Observable<OffenderViolation>[] {
    return this.offenderViolationControl?.value &&
      this.offenderViolationControl?.value?.length
      ? (this.offenderViolationControl?.value || []).map(
          (violationId: number) => {
            return this.offenderViolationService
              .validateLinkOffenderWithViolation(model.id, violationId)
              .pipe(
                tap((res: OffenderViolation[]) => {
                  if (res.length) {
                    res.forEach(offenderViolation => {
                      this.dialog.error(
                        this.lang.map
                          .msg_there_is_already_a_violation_with_same_type_and_date_exist +
                          ' ' +
                          this.lang.map.on_investigation_has_status_x.change({
                            x: offenderViolation.statusInfo.getNames(),
                          }),
                        this.lang.map.can_not_link_violation_x.change({
                          x: this.violations()
                            .find(v => v.id === violationId)
                            ?.violationTypeInfo?.getNames(),
                        }),
                      );
                    });
                  }
                }),
              )
              .pipe(
                switchMap(res => {
                  if (res.length) {
                    return of(new OffenderViolation());
                  }
                  return new OffenderViolation()
                    .clone<OffenderViolation>({
                      caseId: this.caseId(),
                      offenderId: model.id,
                      violationId: violationId,
                      status: 1,
                      proofStatus: ProofTypes.UNDEFINED,
                    })
                    .save()
                    .pipe(
                      tap(offenderViolation => {
                        this.model().offenderViolationInfo = [
                          ...this.model().offenderViolationInfo,
                          new OffenderViolation().clone<OffenderViolation>({
                            ...offenderViolation,
                            offenderInfo: model,
                            violationInfo: this.violations().find(
                              i => i.id === offenderViolation.violationId,
                            ),
                          }),
                        ];
                      }),
                    );
                }),
              );
          },
        )
      : [of(new OffenderViolation())];
  }

  makeSureThatCaseIdExistsBeforeSave(model: Offender): Observable<Offender> {
    return !this.canSave()
      ? (() => {
          this.data.askForSaveModel.emit();
          return this.waitTillPendingSaveDone$.pipe(
            map(() => {
              model.caseId = this.caseId();
              return model;
            }),
          );
        })()
      : of(model);
  }

  listenToSituationSearch() {
    this.situationSearch$
      .pipe(
        switchMap((data: { offender: Offender; isCompany: boolean }) => {
          let id;
          if (data.isCompany) {
            id = (data.offender as unknown as ClearingAgent).agencyId;
          } else {
            if (data.offender.type === OffenderTypes.ClEARING_AGENT) {
              id = (data.offender as unknown as ClearingAgent).agentId;
            } else if (data.offender.type === OffenderTypes.EMPLOYEE) {
              id = data.offender.id;
            }
          }
          return this.dialog
            .open(SituationSearchComponent, {
              data: {
                id,
                type: data.offender.type,
                isCompany: data.isCompany,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  protected readonly OffenderTypes = OffenderTypes;
}
