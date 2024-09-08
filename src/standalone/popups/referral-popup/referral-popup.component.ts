import {
  Component,
  computed,
  EventEmitter,
  inject,
  InputSignal,
  isSignal,
  OnInit,
  signal,
} from '@angular/core';
import { LangService } from '@services/lang.service';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { Offender } from '@models/offender';
import { Investigation } from '@models/investigation';
import { Penalty } from '@models/penalty';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { exhaustMap, forkJoin, Subject, tap } from 'rxjs';
import { filter, map, switchMap, takeUntil } from 'rxjs/operators';
import { SystemPenalties } from '@enums/system-penalties';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CustomValidators } from '@validators/custom-validators';
import { OffenderViolation } from '@models/offender-violation';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { DatePipe, NgTemplateOutlet } from '@angular/common';
import { UnlinkedViolationsComponent } from '@standalone/components/unlinked-violations/unlinked-violations.component';
import { PenaltyDecision } from '@models/penalty-decision';
import { OffenderTypes } from '@enums/offender-types';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { ToastService } from '@services/toast.service';
import { TaskResponses } from '@enums/task-responses';
import { UserClick } from '@enums/user-click';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Violation } from '@models/violation';
import { InfoService } from '@services/info.service';
import { isFunction } from 'rxjs/internal/util/isFunction';
import { LangKeysContract } from '@contracts/lang-keys-contract';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { OrganizationUnit } from '@models/organization-unit';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';

@Component({
  selector: 'app-referral-popup',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatDialogClose,
    ButtonComponent,
    TextareaComponent,
    ReactiveFormsModule,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatCell,
    MatCellDef,
    DatePipe,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    UnlinkedViolationsComponent,
    MatTabGroup,
    MatTab,
    NgTemplateOutlet,
    SelectInputComponent,
  ],
  templateUrl: './referral-popup.component.html',
  styleUrl: './referral-popup.component.scss',
})
export class ReferralPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  organizationUnitService = inject(OrganizationUnitService);
  customsAffairsPAOUInfo =
    inject(InfoService).info.globalSetting.customsAffairsPAOUInfo;
  data = inject<{
    offenders: Offender[];
    model: InputSignal<Investigation>;
    updateModel: InputSignal<EventEmitter<void>> | EventEmitter<void>;
    selectedPenalty?: Penalty;
    isSingle: boolean;
    response?: TaskResponses;
    ask?: boolean;
  }>(MAT_DIALOG_DATA);
  save$ = new Subject<void>();
  complete$ = new Subject<void>();
  isSingle = this.data.isSingle;
  selectedPenalty = this.data.selectedPenalty;
  dialogRef = inject(MatDialogRef);
  toast = inject(ToastService);
  organizations: OrganizationUnit[] = [];
  organizationControl = new FormControl('', {
    validators: CustomValidators.required,
  });
  model = this.data.model;
  penaltyKey = signal(
    this.selectedPenalty ? this.selectedPenalty.penaltyKey : undefined,
  );
  offenders = signal(
    this.data.offenders.filter(
      offender =>
        !this.model().getConcernedOffendersType() ||
        offender.type === this.model().getConcernedOffendersType(),
    ),
  );
  employeesOffenders = computed(() => {
    return this.offenders().filter(
      offender => offender.type === OffenderTypes.EMPLOYEE,
    );
  });
  brokersOffenders = computed(() => {
    return this.offenders().filter(
      offender => offender.type === OffenderTypes.BROKER,
    );
  });
  hasEmployees = computed(() => {
    return this.offenders().some(item => item.type === OffenderTypes.EMPLOYEE);
  });
  hasBrokers = computed(() => {
    return this.offenders().some(item => item.type === OffenderTypes.BROKER);
  });
  hasMixedOffenders = computed(() => {
    return this.hasBrokers() && this.hasEmployees();
  });

  updateModel: EventEmitter<void> = isSignal(this.data.updateModel)
    ? this.data.updateModel()
    : this.data.updateModel;
  response = this.data.response;
  isCase = computed(() => {
    return !!(this.model() && this.response);
  });

  isAsk = signal(this.data.ask);

  isAskDepartment = computed(
    () =>
      this.isAsk() && this.response === TaskResponses.ASK_ANOTHER_DEPARTMENT,
  );

  offendersViolationsMap = computed(() => {
    return this.model().offenderViolationInfo.reduce<
      Record<number, OffenderViolation[]>
    >((acc, item) => {
      if (!acc[item.offenderId]) {
        acc[item.offenderId] = [];
      }
      acc[item.offenderId] = [...acc[item.offenderId], item];
      return acc;
    }, {});
  });
  oldPenaltyDecisionsMap = computed(() => {
    return this.offenders()
      .map(offender => {
        return this.model().getPenaltyDecisionByOffenderId(offender.id);
      })
      .filter(
        (penaltyDecision): penaltyDecision is PenaltyDecision =>
          !!penaltyDecision,
      )
      .reduce<Record<number, PenaltyDecision>>((acc, item) => {
        return { ...acc, [item.offenderId]: item };
      }, {});
  });
  isPresidentRequest = computed(
    () =>
      (this.penaltyKey() &&
        this.penaltyKey() === SystemPenalties.REFERRAL_TO_PRESIDENT) ||
      [TaskResponses.RETURN_TO_PR].includes(this.response!),
  );
  isAssistantRequest = computed(
    () =>
      (this.penaltyKey() &&
        this.penaltyKey() ===
          SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT) ||
      [TaskResponses.RETURN_TO_PA].includes(this.response!),
  );

  displayDefaultForm = computed(() => {
    return (
      !this.isAssistantRequest() ||
      (this.isAssistantRequest() && !this.hasMixedOffenders())
    );
  });

  title = computed(() => {
    return this.selectedPenalty
      ? this.selectedPenalty.getNames()
      : this.lang.map[this.responseTranslateMap[this.response!]];
  });
  // referral_to_the_permanent_disciplinary_council
  // referral_to_the_disciplinary_committee
  referralTextMap: Record<
    | SystemPenalties
    | TaskResponses.RETURN_TO_PR
    | TaskResponses.RETURN_TO_PA
    | TaskResponses.PA_FNL_LAUNCH_LEGAL_AFFAIRS
    | TaskResponses.ASK_ANOTHER_DEPARTMENT
    | TaskResponses.PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL
    | TaskResponses.PA_FNL_LAUNCH_PERMANENT_DISCIPLINARY_COUNCIL
    | TaskResponses.PA_FNL_LAUNCH_DC,
    {
      header: string;
      footer: string;
      whom: string | ((tab?: 'employee' | 'broker') => string);
      complete: string;
    }
  > = {
    [SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS]: {
      header: this.lang.map.static_header_text_for_legal_affairs,
      footer: this.lang.map.static_footer_text_for_legal_affairs,
      whom: this.lang.map.director_of_legal_affairs_department,
      complete: this.lang.map.send,
    },
    [SystemPenalties.REFERRAL_TO_PRESIDENT]: {
      header: this.lang.map.request_static_header_for_president,
      footer: this.lang.map.request_static_footer_for_president,
      whom: this.lang.map.president,
      complete: this.lang.map.send,
    },
    [SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT]: {
      header: this.lang.map.request_static_header_for_president_assistant,
      footer: this.lang.map.request_static_footer_for_president_assistant,
      whom: (tab?: 'employee' | 'broker') => {
        if (!tab) {
          return this.offenders()[0]?.type === OffenderTypes.EMPLOYEE
            ? this.lang.map.vice_president
            : this.customsAffairsPAOUInfo.getNames();
        } else {
          return tab === 'broker'
            ? this.customsAffairsPAOUInfo.getNames()
            : this.lang.map.vice_president;
        }
      },
      complete: this.lang.map.send,
    },
    [SystemPenalties.TERMINATE]: {
      header: '',
      footer: '',
      whom: '',
      complete: this.lang.map.send,
    },
    [SystemPenalties.REFERRAL_DISCIPLINARY_COMMITTEE]: {
      header: this.lang.map.static_header_text_for_disciplinary_committee,
      footer: this.lang.map.static_footer_text_for_disciplinary_committee,
      whom: this.lang.map.chairman_of_the_disciplinary_committee,
      complete: this.lang.map.send,
    },
    [SystemPenalties.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL]: {
      header: this.lang.map.static_header_text_for_disciplinary_council,
      footer: this.lang.map.static_footer_text_for_disciplinary_council,
      whom: this.lang.map.disciplinary_council_director,
      complete: this.lang.map.send,
    },
    [SystemPenalties.SAVE]: {
      header: '',
      footer: '',
      whom: '',
      complete: this.lang.map.send,
    },
    [TaskResponses.RETURN_TO_PR]: {
      header: this.lang.map.static_header_text_for_return_to_president,
      footer: this.lang.map.static_footer_text_for_return_to_president,
      whom: this.lang.map.president,
      complete: this.lang.map.approve,
    },
    [TaskResponses.RETURN_TO_PA]: {
      header:
        this.lang.map.static_header_text_for_return_to_president_assistant,
      footer:
        this.lang.map.static_footer_text_for_return_to_president_assistant,
      whom: (tab?: string) => {
        if (!tab) {
          return this.offenders()[0]?.type === OffenderTypes.EMPLOYEE
            ? this.lang.map.vice_president
            : this.customsAffairsPAOUInfo.getNames();
        } else {
          return tab === 'broker'
            ? this.customsAffairsPAOUInfo.getNames()
            : this.lang.map.vice_president;
        }
      },
      complete: this.lang.map.approve,
    },
    [TaskResponses.ASK_ANOTHER_DEPARTMENT]: {
      header: this.lang.map.request_department_statement_footer,
      footer: this.lang.map.request_department_statement_footer,
      whom: '',
      complete: this.lang.map.send,
    },
    [TaskResponses.PA_FNL_LAUNCH_LEGAL_AFFAIRS]: {
      header: this.lang.map.static_header_text_for_legal_affairs,
      footer: this.lang.map.static_footer_text_for_legal_affairs,
      whom: this.lang.map.director_of_legal_affairs_department,
      complete: this.lang.map.send,
    },
    [TaskResponses.PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL]: {
      header: this.lang.map.static_header_text_for_disciplinary_council,
      footer: this.lang.map.static_footer_text_for_disciplinary_council,
      whom: this.lang.map.disciplinary_council_director,
      complete: this.lang.map.send,
    },
    [TaskResponses.PA_FNL_LAUNCH_PERMANENT_DISCIPLINARY_COUNCIL]: {
      header: this.lang.map.static_header_text_for_disciplinary_council,
      footer: this.lang.map.static_footer_text_for_disciplinary_council,
      whom: this.lang.map.disciplinary_council_director,
      complete: this.lang.map.send,
    },
    [TaskResponses.PA_FNL_LAUNCH_DC]: {
      header: this.lang.map.static_header_text_for_disciplinary_committee,
      footer: this.lang.map.static_footer_text_for_disciplinary_committee,
      whom: this.lang.map.chairman_of_the_disciplinary_committee,
      complete: this.lang.map.send,
    },
  };

  responseTranslateMap: Record<string, keyof LangKeysContract> = {
    [TaskResponses.RETURN_TO_PR]: 'return_to_president',
    [TaskResponses.RETURN_TO_PA]: 'return_to_president_assistant',
    [TaskResponses.ASK_ANOTHER_DEPARTMENT]: 'request_for_department_statement',
    [TaskResponses.PA_FNL_LAUNCH_LEGAL_AFFAIRS]: 'referral_to_legal_affairs',
    [TaskResponses.PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL]:
      'referral_to_the_permanent_disciplinary_council',
    [TaskResponses.PA_FNL_LAUNCH_PERMANENT_DISCIPLINARY_COUNCIL]:
      'referral_to_the_permanent_disciplinary_council',
    [TaskResponses.PA_FNL_LAUNCH_DC]: 'referral_to_the_disciplinary_committee',
  };

  referralKey() {
    return this.selectedPenalty
      ? this.selectedPenalty.penaltyKey
      : (this.response as
          | TaskResponses.RETURN_TO_PA
          | TaskResponses.RETURN_TO_PR
          | TaskResponses.ASK_ANOTHER_DEPARTMENT
          | TaskResponses.PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL
          | TaskResponses.PA_FNL_LAUNCH_PERMANENT_DISCIPLINARY_COUNCIL
          | TaskResponses.PA_FNL_LAUNCH_DC);
  }

  getForWhom(tab?: 'employee' | 'broker'): string {
    const method = this.referralTextMap[this.referralKey()].whom as unknown as (
      tab?: 'employee' | 'broker',
    ) => string;
    const stringValue = method as unknown as string;
    return isFunction(this.referralTextMap[this.referralKey()].whom)
      ? method(tab)
      : stringValue;
  }

  defaultComment = computed(() => {
    return this.model().inSubmitInvestigationActivity()
      ? this.model().getFirstPenaltyComment(this.penaltyKey())
      : this.displayDefaultForm()
        ? this.model().getFirstConcernedPenaltyComment(this.penaltyKey())
        : '';
  });

  employeeComment = computed(() => {
    return this.model().inSubmitInvestigationActivity()
      ? this.model().getFirstEmployeeComment(this.penaltyKey())
      : this.displayDefaultForm()
        ? ''
        : this.model().getFirstConcernedEmployeeComment(this.penaltyKey());
  });

  brokerComment = computed(() => {
    return this.model().inSubmitInvestigationActivity()
      ? this.model().getFirstBrokerComment(this.penaltyKey())
      : this.displayDefaultForm()
        ? ''
        : this.model().getFirstConcernedBrokerComment(this.penaltyKey());
  });

  commentControl = new FormControl(this.defaultComment(), {
    nonNullable: true,
    validators: [CustomValidators.required, CustomValidators.maxLength(10000)],
  });

  employeesComment = new FormControl(this.employeeComment(), {
    nonNullable: true,
    validators: [CustomValidators.required, CustomValidators.maxLength(10000)],
  });
  brokersComment = new FormControl(this.brokerComment(), {
    nonNullable: true,
    validators: [CustomValidators.required, CustomValidators.maxLength(10000)],
  });
  displayedColumns = ['violation', 'violationDate'];
  unlikedViolations = computed(() => {
    return this.model().getUnlinkedViolations();
  });
  unlinkedEmployeesViolations = computed(() => {
    return this.model().getEmployeesUnlinkedViolations();
  });
  unlinkedBrokersViolations = computed(() => {
    return this.model().getBrokersUnlinkedViolations();
  });

  get formHeader() {
    return this.referralTextMap[this.referralKey()].header;
  }

  get formFooter() {
    return this.referralTextMap[this.referralKey()].footer;
  }

  get complete() {
    return this.referralTextMap[this.referralKey()].complete;
  }

  ngOnInit(): void {
    this.listenToSave();
    this.listenToComplete();
    this.loadDepartmentsForAsk();
  }

  assertType(item: unknown): OffenderViolation {
    return item as OffenderViolation;
  }

  private listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map(() =>
          this.displayDefaultForm()
            ? this.commentControl.valid
            : this.employeesComment.valid && this.brokersComment.valid,
        ),
      )
      .pipe(
        tap(
          valid =>
            !valid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
        ),
      )
      .pipe(filter(valid => valid))
      .pipe(
        map(() => {
          return this.offenders().map(item => {
            return new PenaltyDecision()
              .clone<PenaltyDecision>({
                ...this.oldPenaltyDecisionsMap()[item.id],
                signerId: this.employeeService.getEmployee()?.id,
                caseId: this.model().id,
                penaltyId: this.selectedPenalty!.id,
                offenderId: item.id,
                status: 1,
                tkiid: this.model().getTaskId(),
                roleAuthName: this.model().getTeamDisplayName(),
                comment: this.displayDefaultForm()
                  ? this.commentControl.value
                  : item.type === OffenderTypes.BROKER
                    ? this.brokersComment.value
                    : this.employeesComment.value,
              })
              .create();
          });
        }),
      )
      .pipe(
        switchMap(penaltiesDecisions => {
          return forkJoin(penaltiesDecisions).pipe(
            map(values => {
              return values.map(item => {
                item.penaltyInfo = this.selectedPenalty!;
                return item;
              });
            }),
          );
        }),
      )
      .subscribe(penaltiesDecisions => {
        penaltiesDecisions.forEach(item => {
          this.model().removePenaltyDecision(
            this.oldPenaltyDecisionsMap()[item.offenderId],
          );
          this.model().appendPenaltyDecision(item);
        });
        this.updateModel.emit();
        this.toast.success(this.lang.map.the_penalty_saved_successfully);
        this.dialogRef.close();
      });
  }

  private listenToComplete() {
    this.complete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        map(() =>
          this.displayDefaultForm()
            ? this.commentControl.valid &&
              (this.isAskDepartment() ? this.organizationControl.valid : true)
            : this.brokersComment.valid && this.employeesComment.valid,
        ),
      )
      .pipe(
        filter(valid => {
          !valid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            );
          return valid;
        }),
      )
      .pipe(
        exhaustMap(() => {
          const service = this.model().getService();
          return this.isAskDepartment()
            ? service.askForDepartmentReview(this.model().getTaskId()!, [
                Number(this.organizationControl.value),
              ])
            : service.completeTask(this.model().getTaskId()!, {
                comment:
                  this.isAssistantRequest() && this.hasMixedOffenders()
                    ? JSON.stringify([
                        {
                          type: OffenderTypes.EMPLOYEE,
                          comment: this.employeesComment.value,
                        },
                        {
                          type: OffenderTypes.BROKER,
                          comment: this.brokersComment.value,
                        },
                      ])
                    : this.commentControl.value,
                selectedResponse: this.response!,
              });
        }),
      )
      .subscribe(() => {
        this.toast.success(
          this.lang.map.msg_x_performed_successfully.change({
            x: this.selectedPenalty ? this.selectedPenalty.getNames() : '',
          }),
        );
        this.dialogRef.close(UserClick.YES);
      });
  }

  filterEmployeeViolations(v: Violation) {
    return v.offenderTypeInfo.lookupKey === OffenderTypes.EMPLOYEE;
  }

  filterBrokerViolations(v: Violation) {
    return v.offenderTypeInfo.lookupKey === OffenderTypes.BROKER;
  }

  private loadDepartmentsForAsk() {
    this.isAskDepartment() &&
      this.organizationUnitService
        .loadAsLookups()
        .pipe(takeUntil(this.destroy$))
        .subscribe(list => {
          this.organizations = list;
        });
  }
}
