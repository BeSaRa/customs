import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Component, OnInit, inject } from '@angular/core';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { Subject, takeUntil, filter, switchMap } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, UntypedFormGroup } from '@angular/forms';
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

@Component({
  selector: 'app-comment-popup',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ButtonComponent, SelectInputComponent, IconButtonComponent, TextareaComponent, MatDialogModule],
  templateUrl: './comment-popup.component.html',
  styleUrls: ['./comment-popup.component.scss'],
})
export class CommentPopupComponent extends OnDestroyMixin(class { }) implements OnInit {
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef);
  comment$ = new Subject<void>();
  form!: UntypedFormGroup;
  model: Investigation = this.data && (this.data.model as Investigation);
  response: TaskResponses = this.data && (this.data.response as TaskResponses);
  taskResponses = TaskResponses;
  usersList: InternalUserOU[] = [];
  previewFormList: TaskResponses[] = [
    TaskResponses.TO_MANAGER,
    TaskResponses.MANAGER_APPROVE,
    TaskResponses.REFERRAL_TO_PRESODENT_ASSISTANT,
    TaskResponses.REFERRAL_TO_PRESODENT,
  ];
  isPreviewForm = false;
  constructor(
    private internalUserOUService: InternalUserOUService,
    private employeeService: EmployeeService
  ) {
    super();
  }
  ngOnInit() {
    this.buildForm();
    this.listenToComment();
    this._loadUsersList();
    this.isPreviewForm = this.previewFormList.includes(this.response);
    this.model.offenderInfo.forEach(offender => {
      let newOffender = {
        name: offender.offenderInfo?.arName ? offender.offenderInfo.arName : '',
        jobTitle: offender.typeInfo.arName ? offender.typeInfo.arName : '',
        violations: [{}],
      };
      offender.violations.forEach(violation => {
        newOffender.violations.push({ name: violation.violationId });
      });
      this.violations.push(newOffender);
    });
  }
  get isSendToUser() {
    return this.response == TaskResponses.TO_USER;
  }
  private _loadUsersList() {
    if (this.isSendToUser) {
      this.internalUserOUService.internalUserOUCriteria({
        organizationUnitId: this.employeeService.getOrganizationUnit()?.id
      }).subscribe((data) => {
        this.usersList = data;
      })
    }
  }
  buildForm() {
    this.form = new UntypedFormGroup({
      comment: new UntypedFormControl('', [CustomValidators.required]),
      userId: new UntypedFormControl(null, []),
    });
    if (this.isSendToUser) {
      this.form.get('userId')?.setValidators([CustomValidators.required]);
      this.form.get('userId')?.updateValueAndValidity();
    }
  }
  listenToComment() {
    this.comment$
      .pipe(takeUntil(this.destroy$))
      .pipe(filter(_ => !!this.form.valid))
      .pipe(
        switchMap(() => {
          const completeBody = {
            selectedResponse: this.response,
            comment: this.form.value.comment,
            userId: this.form.value.userId
          };
          if (!this.isSendToUser) {
            delete completeBody.userId;
          }
          return this.model.getService().completeTask(this.model.taskDetails.tkiid, completeBody);
        })
      )
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }
  get sendToName() {
    if (this.response === this.taskResponses.REFERRAL_TO_PRESODENT) {
      return '';
    } else if (this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT) {
      return '';
    }
    return 'احمد';
  }

  get sendToTitle() {
    if (this.response === this.taskResponses.REFERRAL_TO_PRESODENT) {
      return 'الرئيس';
    } else if (this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT) {
      return 'مساعد الرئيس';
    }
    return '';
  }
  get formNumberAndType() {
    if (this.response === this.taskResponses.TO_MANAGER) {
      return 'رقم مسودة التحقيق: ((الرقم))';
    } else if (
      // this.response === this.taskResponses.FORM2 ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT
      // this.response === this.taskResponses.FORM4 ||
      // this.response === this.taskResponses.FORM5 ||
      // this.response === this.taskResponses.FORM6 ||
      // this.response === this.taskResponses.FORM7
    ) {
      return 'رقم ملف التحقيق:' + this.model.caseIdentifier;
    }
    return '';
  }
  get decisionNumberAndType() {
    if (
      // this.response === this.taskResponses.FORM2 ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT
      // this.response === this.taskResponses.FORM7
    ) {
      return 'رقم القرار:((الرقم))';
    }
    // else if (this.response === this.taskResponses.FORM5) {
    //   return 'رقم القرار السحب:((الرقم))';
    // } else if (this.response === this.taskResponses.FORM6) {
    //   return 'رقم القرار الاحالة:((الرقم))';
    // }
    return '';
  }
  get formDateAndType() {
    if (this.response === this.taskResponses.TO_MANAGER) {
      return 'تاريخ مسودة التحقيق: ((التاريخ))';
    } else if (
      // this.response === this.taskResponses.FORM2 ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT
      // this.response === this.taskResponses.FORM7
    ) {
      return 'تاريخ القرار: ((التاريخ))';
    }
    // else if (this.response === this.taskResponses.FORM4) {
    //   return 'تاريخ الطلب: ((التاريخ))';
    // } else if (this.response === this.taskResponses.FORM5) {
    //   return 'تاريخ القرار السحب: ((التاريخ))';
    // } else if (this.response === this.taskResponses.FORM6) {
    //   return 'تاريخ القرار الاحالة: ((التاريخ))';
    // }
    return '';
  }
  get formName() {
    if (
      this.response === this.taskResponses.TO_MANAGER
      // ||
      // this.response === this.taskResponses.FORM4 ||
      // this.response === this.taskResponses.FORM5 ||
      // this.response === this.taskResponses.FORM6
    ) {
      return 'اسم النموذج';
    }
    // else if (this.response === this.taskResponses.FORM2) {
    //   return 'نوع القرار';
    // }
    else if (this.response === this.taskResponses.REFERRAL_TO_PRESODENT || this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT) {
      return 'طلب احالة';
    }
    return '';
  }
  get upperFixedText() {
    if (
      this.response === this.taskResponses.TO_MANAGER ||
      // this.response === this.taskResponses.FORM2 ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT
      // this.response === this.taskResponses.FORM4 ||
      // this.response === this.taskResponses.FORM5 ||
      // this.response === this.taskResponses.FORM6 ||
      // this.response === this.taskResponses.FORM7
    )
      return 'نص ثابت تقوم بتوفيره الهيئة نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص نص';
    return '';
  }
  get lowerFixedText() {
    if (
      this.response === this.taskResponses.TO_MANAGER ||
      // this.response === this.taskResponses.FORM2 ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT
      // this.response === this.taskResponses.FORM4 ||
      // this.response === this.taskResponses.FORM5 ||
      // this.response === this.taskResponses.FORM6 ||
      // this.response === this.taskResponses.FORM7
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
  offenders!: [{ name: string; jobTitle: string; violations: [{ name: 'مخالفة ١' }] }];
  violations = [{ name: 'مخالفة ١' }, { name: 'مخالفة ٢' }];
  violation = { name: 'مخالفة ١', date: '1/1/2021' };

  get justifyEnd() {
    return (
      this.response === this.taskResponses.TO_MANAGER
      // || this.response === this.taskResponses.FORM4 || this.response === this.taskResponses.FORM5
    );
  }
  get justifyBetween() {
    return (
      // this.response === this.taskResponses.FORM2 ||
      this.response === this.taskResponses.REFERRAL_TO_PRESODENT || this.response === this.taskResponses.REFERRAL_TO_PRESODENT_ASSISTANT
      // this.response === this.taskResponses.FORM6 ||
      // this.response === this.taskResponses.FORM7
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
