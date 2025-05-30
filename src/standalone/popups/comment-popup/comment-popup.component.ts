import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Component, computed, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { filter, of, Subject, switchMap, takeUntil } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { CustomValidators } from '@validators/custom-validators';
import { Investigation } from '@models/investigation';
import { TaskResponses } from '@enums/task-responses';
import { UserClick } from '@enums/user-click';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { CommonModule } from '@angular/common';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { EmployeeService } from '@services/employee.service';
import { InternalUserOUService } from '@services/internal-user-ou.service';
import { InternalUserOU } from '@models/internal-user-ou';
import { TeamService } from '@services/team.service';
import { TeamNames } from '@enums/team-names';
import { InternalUser } from '@models/internal-user';
import { PenaltyDecision } from '@models/penalty-decision';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { ActivitiesName } from '@enums/activities-name';
import { StepsName } from '@enums/steps-name';
import { ReassignService } from '@services/reassign.service';
import { OffenderTypes } from '@enums/offender-types';
import { isFunction } from 'rxjs/internal/util/isFunction';

@Component({
  selector: 'app-comment-popup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonComponent,
    SelectInputComponent,
    IconButtonComponent,
    TextareaComponent,
    MatDialogModule,
  ],
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss'],
})
export class CommentPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  employee = inject(EmployeeService).getEmployee();
  penaltyDecisionService = inject(PenaltyDecisionService);
  reassignService = inject(ReassignService);
  comment$ = new Subject<void>();
  reassign$ = new Subject<void>();
  form!: UntypedFormGroup;
  reassignForm!: UntypedFormGroup;
  model: Investigation = this.data && (this.data.model as Investigation);
  response: TaskResponses = this.data && (this.data.response as TaskResponses);

  taskResponses = TaskResponses;
  usersList: InternalUserOU[] | InternalUser[] = [];
  private internalUserOUService = inject(InternalUserOUService);
  private teamService = inject(TeamService);

  private employeeService = inject(EmployeeService);
  ouId = this.employeeService.getOrganizationUnit()!.id;
  previewFormList: TaskResponses[] = [
    TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT,
    TaskResponses.REFERRAL_TO_PRESIDENT,
    TaskResponses.DC_RETURN_PA,
    TaskResponses.PA_FNL_LAUNCH_DISCIPLINARY_COUNCIL,
    TaskResponses.RETURN_APP_MANAGER,
  ];
  statementResponses: TaskResponses[] = [
    TaskResponses.STM_DEP_APPROVE,
    TaskResponses.STM_RETURN_CREATOR,
    TaskResponses.STM_REPLY,
  ];
  isPreviewForm = false;

  concernedOffenders = computed(() => this.model.getConcernedOffenders());
  offendersIds = computed(() => this.concernedOffenders().map(i => i.id));

  penaltiesDecisionsMap =
    this.model.penaltyDecisions?.reduce(
      (acc, item) => {
        return this.offendersIds().includes(item.offenderId)
          ? { ...acc, [item.offenderId]: item }
          : { ...acc };
      },
      {} as Record<number, PenaltyDecision>,
    ) || {};

  ngOnInit() {
    this.buildForm();
    this.listenToComment();
    this.listenToReassign();
    this._loadUsersList();
    this.isPreviewForm = this.previewFormList.includes(this.response);
  }

  get isStatementReply() {
    return this.response === TaskResponses.STM_REPLY;
  }

  get isSendToUser() {
    return this.response === TaskResponses.TO_USER;
  }

  get isSendToHrUser() {
    return this.response === TaskResponses.TO_HR_USER;
  }

  get isSendToInvestigator() {
    return this.response === TaskResponses.TO_INV_USER;
  }

  get isSendToPAOfficeUser() {
    return this.response === TaskResponses.TO_PAO_USER;
  }

  get isSendToPOfficeUser() {
    return this.response === TaskResponses.TO_PO_USER;
  }

  get isStatementResponse() {
    return this.statementResponses.includes(this.response);
  }

  get isReviewCustomsAffairsActivity() {
    return this.model.inActivity(ActivitiesName.REVIEW_CUSTOMS_AFFAIRS);
  }

  get isReassign() {
    return this.response === TaskResponses.REASSIGN;
  }

  get isSendToPaUser() {
    return this.response === TaskResponses.TO_PA_USER;
  }
  get isSendToPrUser() {
    return this.response === TaskResponses.TO_PR_USER;
  }

  private _loadUsersList() {
    const loadTeamMembers = (team: TeamNames) => {
      this.teamService.loadTeamMembers(team, this.ouId).subscribe(data => {
        this.usersList = data;
      });
    };

    if (this.isSendToHrUser) return loadTeamMembers(TeamNames.Human_Resources);
    if (this.isSendToUser) {
      return this.isReviewCustomsAffairsActivity
        ? loadTeamMembers(TeamNames.Customs_Affairs)
        : this.internalUserOUService
            .internalUserOUCriteria({
              organizationUnitId:
                this.employeeService.getOrganizationUnit()?.id,
            })
            .subscribe(data => {
              this.usersList = data;
            });
    }
    if (this.isSendToPaUser) {
      return loadTeamMembers(
        this.isEmployee
          ? TeamNames.President_Assistant
          : TeamNames.CA_President_Assistant,
      );
    }
    if (this.isSendToPrUser) {
      return loadTeamMembers(TeamNames.President);
    }
    if (this.isSendToInvestigator)
      return this.teamService
        .loadTeamMembersWithPS(
          TeamNames.Investigator,
          this.model.getConcernedOffendersIds(),
          this.ouId,
        )
        .subscribe(data => {
          this.usersList = data;
        });
    if (
      this.isSendToPAOfficeUser &&
      this.employeeService.getOrganizationUnit()?.id
    ) {
      return loadTeamMembers(
        this.isEmployee
          ? TeamNames.President_Assistant_Office
          : TeamNames.CA_President_Assistant_Office,
      );
    }
    if (this.isSendToPOfficeUser)
      return loadTeamMembers(TeamNames.President_Office);

    if (this.isReassign) return this._handleReassignment();
  }

  private _handleReassignment() {
    const loadTeamMembers = (team: TeamNames) => {
      this.teamService.loadTeamMembers(team, this.ouId).subscribe(data => {
        this.usersList = data;
      });
    };

    const taskName = this.model.taskDetails.name as StepsName;
    const activityName = this.model.getActivityName();
    const isEmployee = this.isEmployee;

    const teamMappings: Record<string, Record<string, TeamNames>> = {
      [ActivitiesName.REVIEW_PRESIDENT]: {
        [StepsName.PRESIDENT_USER_REVIEW]: TeamNames.President,
        [StepsName.PRESIDENT_REVIEW]: TeamNames.President,
        [StepsName.PRESIDENT_OFFICE_USER_REVIEW]: TeamNames.President_Office,
        [StepsName.PRESIDENT_OFFICE_REVIEW]: TeamNames.President_Office,
      },
      [ActivitiesName.REVIEW_PRESIDENT_ASSISTANT]: {
        [StepsName.PRESIDENT_ASSISTANT_REVIEW]: isEmployee
          ? TeamNames.President_Assistant
          : TeamNames.CA_President_Assistant,
        [StepsName.PRESIDENT_ASSISTANT_USER_REVIEW]: isEmployee
          ? TeamNames.President_Assistant
          : TeamNames.CA_President_Assistant,
        [StepsName.PRESIDENT_ASSISTANT_OFFICE_REVIEW]: isEmployee
          ? TeamNames.President_Assistant_Office
          : TeamNames.CA_President_Assistant_Office,
        [StepsName.PRESIDENT_ASSISTANT_OFFICE_USER_REVIEW]: isEmployee
          ? TeamNames.President_Assistant_Office
          : TeamNames.CA_President_Assistant_Office,
      },
      [ActivitiesName.REVIEW_FINAL_PRESIDENT_ASSISTANT]: {
        [StepsName.PRESIDENT_ASSISTANT_FINAL_REVIEW]: isEmployee
          ? TeamNames.President_Assistant
          : TeamNames.CA_President_Assistant,
        [StepsName.PRESIDENT_ASSISTANT_FINAL_USER_REVIEW]: isEmployee
          ? TeamNames.President_Assistant
          : TeamNames.CA_President_Assistant,
        [StepsName.PRESIDENT_ASSISTANT_OFFICE_FINAL_USER_REVIEW]: isEmployee
          ? TeamNames.President_Assistant_Office
          : TeamNames.CA_President_Assistant_Office,
        [StepsName.PRESIDENT_ASSISTANT_OFFICE_FINAL_REVIEW]: isEmployee
          ? TeamNames.President_Assistant_Office
          : TeamNames.CA_President_Assistant_Office,
      },
    };
    if (activityName && taskName && teamMappings[activityName]?.[taskName]) {
      return loadTeamMembers(teamMappings[activityName][taskName]);
    }
  }

  buildForm() {
    this.form = new UntypedFormGroup({
      comment: new UntypedFormControl('', [CustomValidators.maxLength(100000)]),
      userId: new UntypedFormControl(null, []),
    });
    if (this.isReassign)
      this.reassignForm = new UntypedFormGroup({
        toUser: new UntypedFormControl(''),
      });
    if (
      this.isSendToUser ||
      this.isSendToInvestigator ||
      this.isSendToHrUser ||
      this.isSendToPAOfficeUser ||
      this.isSendToPOfficeUser ||
      this.isSendToPaUser ||
      this.isSendToPrUser
    ) {
      this.form.get('userId')?.setValidators([CustomValidators.required]);
      this.form.get('userId')?.updateValueAndValidity();
    }
    if (this.isStatementReply) {
      this.form.get('comment')?.setValidators([CustomValidators.required]);
    }
    this.form.updateValueAndValidity();
  }

  listenToReassign() {
    this.reassign$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => this.reassignForm.valid))
      .pipe(
        switchMap(() => {
          const completeBody = {
            tkiid: this.model.taskDetails.tkiid,
            caseId: this.model.id,
            toUser: this.reassignForm.value.toUser,
          };
          return this.reassignService.reassign(completeBody);
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }
  listenToComment() {
    this.comment$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => this.form.valid))
      .pipe(
        switchMap(() => {
          if (
            this.response === this.taskResponses.DC_RETURN_PA &&
            !this.model.inMyInbox()
          ) {
            return this.model.claim();
          }
          return of(null);
        }),
      )
      .pipe(
        switchMap(() => {
          const decisionsNeedUpdates = Object.values(
            this.penaltiesDecisionsMap,
          ).filter(item => {
            return item.signerId !== this.employee!.id;
          });
          return decisionsNeedUpdates.length
            ? this.penaltyDecisionService.createBulkFull(
                decisionsNeedUpdates.map(item => {
                  return item.clone<PenaltyDecision>({
                    ...item,
                    signerId: this.employee!.id,
                    tkiid: this.model.getTaskId(),
                    roleAuthName: this.model.getTeamDisplayName(),
                  });
                }),
              )
            : of(null);
        }),
      )
      .pipe(
        switchMap(() => {
          const completeBody = {
            selectedResponse: this.response,
            comment: this.form.value.comment,
            userId: this.form.value.userId,
          };
          if (
            !this.isSendToUser &&
            !this.isSendToInvestigator &&
            !this.isSendToHrUser &&
            !this.isSendToPAOfficeUser &&
            !this.isSendToPOfficeUser &&
            !this.isSendToPaUser &&
            !this.isSendToPrUser
          ) {
            delete completeBody.userId;
          }
          return this.model
            .getService()
            .completeTask(this.model.taskDetails.tkiid, completeBody);
        }),
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }

  get sendToName() {
    if (this.response === this.taskResponses.REFERRAL_TO_PRESIDENT) {
      return '';
    } else if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return '';
    }
    return '';
  }

  get sendToTitle() {
    if (this.response === this.taskResponses.REFERRAL_TO_PRESIDENT) {
      return 'الرئيس';
    } else if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return 'مساعد الرئيس';
    }
    return '';
  }

  get formNumberAndType() {
    if (this.response === this.taskResponses.TO_MANAGER) {
      return 'رقم مسودة التحقيق: ((الرقم))';
    } else if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return 'رقم ملف التحقيق:' + this.model.caseIdentifier;
    }
    return '';
  }

  get decisionNumberAndType() {
    if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return 'رقم القرار:((الرقم))';
    }
    // else if (this.response === this.taskResponses) {
    //   return 'رقم القرار السحب:((الرقم))';
    // } else if (this.response === this.taskResponses) {
    //   return 'رقم القرار الاحالة:((الرقم))';
    // }
    return '';
  }

  get formDateAndType() {
    if (this.response === this.taskResponses.TO_MANAGER) {
      return 'تاريخ مسودة التحقيق: ((التاريخ))';
    } else if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return 'تاريخ القرار: ((التاريخ))';
    }
    return '';
  }

  get formName() {
    if (this.response === this.taskResponses.TO_MANAGER) {
      return 'اسم النموذج';
    } else if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return 'طلب احالة';
    }
    return '';
  }

  get signature() {
    return 'صورة التوقيع';
  }

  get sendFromName() {
    return 'اسم الموقع';
  }

  get sendFromJobTitle() {
    return 'صفة الموقع';
  }

  get justifyEnd() {
    return this.response === this.taskResponses.TO_MANAGER;
  }

  get justifyBetween() {
    return (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    );
  }

  get isEmployee() {
    return this.model.getConcernedOffendersType() === OffenderTypes.EMPLOYEE;
  }

  get isClearingAgent() {
    return !this.isEmployee;
  }

  get copyToHumanResources() {
    return 'نسخة الى الموارد البشرية';
  }

  get copyToLegalAffairs() {
    return 'نسخة الى الشؤون القانونية';
  }

  defaultCommentText = {
    header: '',
    footer: '',
    complete: this.lang.map.approve,
    title: this.lang.map.comment,
  };

  get responseKey() {
    return this.response as
      | TaskResponses.RETURN_APP_MANAGER
      | TaskResponses.STM_REPLY
      | TaskResponses.TO_INV_USER
      | TaskResponses.REASSIGN
      | TaskResponses.DC_RETURN_PA;
  }

  commentTextMap: Record<
    | TaskResponses.RETURN_APP_MANAGER
    | TaskResponses.STM_REPLY
    | TaskResponses.TO_INV_USER
    | TaskResponses.REASSIGN
    | TaskResponses.DC_RETURN_PA,
    {
      header: string;
      footer: string | ((tab?: 'employee' | 'broker' | 'mixed') => string);
      complete: string;
      title: string;
    }
  > = {
    [TaskResponses.RETURN_APP_MANAGER]: {
      ...this.defaultCommentText,
      header:
        this.lang.map
          .static_header_text_return_from_president_assistant_to_app_manager,
      footer: (tab?: 'employee' | 'broker' | 'mixed') => {
        if (tab === 'broker') {
          return this.lang.map
            .static_footer_text_return_from_president_assistant_to_app_manager_broker;
        } else if (tab === 'employee')
          return this.lang.map.static_footer_text_for_decision_employee;
        else
          return this.lang.map
            .static_footer_text_return_from_president_assistant_to_app_manager;
      },
      title: this.lang.map.return_referral_request,
    },
    [TaskResponses.STM_REPLY]: {
      ...this.defaultCommentText,
      complete: this.lang.map.reply_to_statement,
    },
    [TaskResponses.TO_INV_USER]: {
      ...this.defaultCommentText,
      complete: this.lang.map.save,
    },
    [TaskResponses.REASSIGN]: {
      ...this.defaultCommentText,
      title: this.lang.map.reassign,
    },
    [TaskResponses.DC_RETURN_PA]: {
      ...this.defaultCommentText,
      header:
        this.lang.map
          .static_header_text_return_from_president_assistant_to_app_manager,
      footer: (tab?: 'employee' | 'broker' | 'mixed') => {
        if (tab === 'broker') {
          return this.lang.map
            .static_footer_text_return_from_president_assistant_to_app_manager_broker;
        } else if (tab === 'employee')
          return this.lang.map.static_footer_text_for_decision_employee;
        else
          return this.lang.map
            .static_footer_text_return_from_president_assistant_to_app_manager;
      },
      title: this.lang.map.return_referral_request,
    },
  };

  get commentText() {
    return this.commentTextMap[this.responseKey] || this.defaultCommentText;
  }
  get formHeader() {
    return this.commentText.header;
  }
  hasEmployees = computed(() => {
    return this.concernedOffenders().some(
      item => item.type === OffenderTypes.EMPLOYEE,
    );
  });
  hasBrokers = computed(() => {
    return this.concernedOffenders().some(
      item => item.type === OffenderTypes.BROKER,
    );
  });
  hasMixedOffenders = computed(() => {
    return this.hasBrokers() && this.hasEmployees();
  });
  get formFooter(): string {
    const footer = this.commentText.footer;
    const tab = this.hasMixedOffenders()
      ? 'mixed'
      : this.hasBrokers()
        ? 'broker'
        : 'employee';
    return isFunction(footer) ? footer(tab) : footer;
  }

  get formTitle() {
    return this.commentText.title;
  }

  get formComplete() {
    return this.commentText.complete;
  }
}
