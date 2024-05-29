import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Component, computed, inject, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { Subject, takeUntil, filter, switchMap, of } from 'rxjs';
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
  comment$ = new Subject<void>();
  form!: UntypedFormGroup;
  model: Investigation = this.data && (this.data.model as Investigation);
  response: TaskResponses = this.data && (this.data.response as TaskResponses);

  taskResponses = TaskResponses;
  usersList: InternalUserOU[] | InternalUser[] = [];
  private internalUserOUService = inject(InternalUserOUService);
  private teamService = inject(TeamService);

  private employeeService = inject(EmployeeService);

  previewFormList: TaskResponses[] = [
    TaskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT,
    TaskResponses.REFERRAL_TO_PRESIDENT,
    TaskResponses.DC_RETURN_PA,
  ];
  isPreviewForm = false;

  concernedOffenders = computed(() => this.model.getConcernedOffenders());
  offendersIds = computed(() => this.concernedOffenders().map(i => i.id));

  penaltiesDecisionsMap = this.model.penaltyDecisions.reduce(
    (acc, item) => {
      return this.offendersIds().includes(item.offenderId)
        ? { ...acc, [item.offenderId]: item }
        : { ...acc };
    },
    {} as Record<number, PenaltyDecision>,
  );

  ngOnInit() {
    this.buildForm();
    this.listenToComment();
    this._loadUsersList();
    this.isPreviewForm = this.previewFormList.includes(this.response);
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

  private _loadUsersList() {
    if (this.isSendToUser || this.isSendToHrUser) {
      this.internalUserOUService
        .internalUserOUCriteria({
          organizationUnitId: this.employeeService.getOrganizationUnit()?.id,
        })
        .subscribe(data => {
          this.usersList = data;
        });
    } else if (this.isSendToInvestigator) {
      this.teamService
        .loadTeamMembers(TeamNames.Investigator)
        .subscribe(data => {
          this.usersList = data;
        });
    }
  }

  buildForm() {
    this.form = new UntypedFormGroup({
      comment: new UntypedFormControl('', [CustomValidators.maxLength(100000)]),
      userId: new UntypedFormControl(null, []),
    });
    if (this.isSendToUser || this.isSendToInvestigator || this.isSendToHrUser) {
      this.form.get('userId')?.setValidators([CustomValidators.required]);
      this.form.get('userId')?.updateValueAndValidity();
    }
  }

  listenToComment() {
    this.comment$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(() => this.form.valid))
      .pipe(
        switchMap(() => {
          if (this.response === this.taskResponses.DC_RETURN_PA) {
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
            !this.isSendToHrUser
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
    }
    // else if (this.response === this.taskResponses) {
    //   return 'نوع القرار';
    // }
    else if (
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    ) {
      return 'طلب احالة';
    }
    return '';
  }

  get upperFixedText() {
    if (
      this.response === this.taskResponses.TO_MANAGER ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    )
      return 'نص ثابت تقوم بتوفيره الهيئة نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص';
    return '';
  }

  get lowerFixedText() {
    if (
      this.response === this.taskResponses.TO_MANAGER ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESIDENT_ASSISTANT
    )
      return 'نص ثابت تقوم بتوفيره الهيئة نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص';
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

  offenders!: [
    { name: string; jobTitle: string; violations: [{ name: 'مخالفة ١' }] },
  ];
  violations = [{ name: 'مخالفة ١' }, { name: 'مخالفة ٢' }];
  violation = { name: 'مخالفة ١', date: '1/1/2021' };

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
    return true;
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
}
