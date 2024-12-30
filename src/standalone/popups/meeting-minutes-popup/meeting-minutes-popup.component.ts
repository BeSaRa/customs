import { Component, inject, OnInit, Signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { GeneralStatusEnum } from '@enums/general-status-enum';
import { MeetingStatusEnum } from '@enums/meeting-status-enum';
import { OperationType } from '@enums/operation-type';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { AdminResult } from '@models/admin-result';
import { InternalUser } from '@models/internal-user';
import { Investigation } from '@models/investigation';
import { Meeting } from '@models/meeting';
import { MeetingAttendance } from '@models/meeting-attendance';
import { MeetingMinutes } from '@models/meeting-minutes';
import { DialogService } from '@services/dialog.service';
import { InvestigationService } from '@services/investigation.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { TeamService } from '@services/team.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MeetingAttendanceListComponent } from '@standalone/components/meeting-attendance-list/meeting-attendance-list.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { ControlDirective } from '@standalone/directives/control.directive';
import { CustomValidators } from '@validators/custom-validators';
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerDirective,
} from 'ngx-mat-timepicker';
import { filter, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';

@Component({
  selector: 'app-meeting-minutes-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatDialogClose,
    ReactiveFormsModule,
    SelectInputComponent,
    TextareaComponent,
    ControlDirective,
    InputComponent,
    MatDatepicker,
    NgxMatTimepickerDirective,
    NgxMatTimepickerComponent,
    MatDatepickerInput,
    MeetingAttendanceListComponent,
  ],
  templateUrl: './meeting-minutes-popup.component.html',
  styleUrl: './meeting-minutes-popup.component.scss',
})
export class MeetingMinutesPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dialogRef = inject(MatDialogRef);
  investigationService = inject(InvestigationService);
  fb = inject(FormBuilder);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  teamService = inject(TeamService);
  save$: Subject<void> = new Subject<void>();
  form: FormGroup = new FormGroup({});
  todayDate = new Date();
  minDate = this.data.extras?.minDate;
  caseId = this.data.extras?.caseId;
  operation = this.data.extras?.operation;
  model: Meeting | undefined = this.data.model;
  minutesModel: MeetingMinutes = this.data.extras?.minutesModel;
  investigationModel: Signal<Investigation> =
    this.data.extras?.investigationModel;
  attendanceList: MeetingAttendance[] = [];
  concernedOffendersIds = this.data.extras?.concernedOffendersIds;
  meetingStatus = this.lookupService.lookups.meetingStatus;

  ngOnInit(): void {
    this.buildForm();
    this.listenToSave();
    this.getAttendanceList();
  }

  get readonlyMeetingData() {
    return this.operation === OperationType.VIEW;
  }

  getAttendanceList() {
    this.teamService
      .loadDCTeamMembers()
      .pipe(
        map((users: InternalUser[]) => {
          return users.map((user: InternalUser) => {
            const attendance = this.model?.attendanceList?.find(
              attend => attend.attendeeId === user.id,
            );
            return new MeetingAttendance().clone<MeetingAttendance>({
              attendeeId: user.id,
              attendeeInfo: AdminResult.createInstance({
                id: user.id,
                arName: user.arName,
                enName: user.enName,
              }),
              status: attendance?.status || 0,
            });
          });
        }),
      )
      .pipe(
        map(list => {
          return this.readonlyMeetingData
            ? list.map(attend => {
                return new MeetingAttendance().clone<MeetingAttendance>({
                  ...attend,
                  status:
                    this.model?.attendanceList.find(
                      att => att.attendeeId === attend.attendeeId,
                    )?.status || 0,
                });
              })
            : list;
        }),
      )
      .subscribe(rs => {
        this.attendanceList = rs;
      });
  }

  buildForm() {
    this.form = this.fb.group(
      new Meeting()
        .clone<Meeting>(this.model)
        .buildForm(true, this.readonlyMeetingData),
    );
    this.form
      .get('meetingMinutesText')
      ?.setValidators([
        CustomValidators.required,
        CustomValidators.maxLength(3000),
      ]);
    this.form.get('status')?.setValidators([CustomValidators.required]);
    if (!this.model || (this.minutesModel && this.minutesModel.id)) {
      this.form.get('status')?.disable();
      this.form.get('status')?.setValue(MeetingStatusEnum.held);
    }
    if (this.operation === OperationType.VIEW) {
      this.form.disable();
    }
  }

  listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap(
          () =>
            (this.form.invalid &&
              this.dialog.error(
                this.lang.map.msg_make_sure_all_required_fields_are_filled,
              )) ||
            (!this.attendanceList.filter(attend => attend.status).length &&
              this.dialog.error(this.lang.map.must_select_attendance)),
        ),
      )
      .pipe(
        filter(
          () =>
            this.form.valid &&
            !!this.attendanceList.filter(attend => attend.status).length,
        ),
      )
      .pipe(
        switchMap(() => {
          return new Meeting()
            .clone<Meeting>({
              ...this.model,
              caseId: this.caseId,
              ...this.form.value,
              offenderList: this.concernedOffendersIds,
            })
            .save();
        }),
      )
      .pipe(
        switchMap(model => {
          if (
            this.minutesModel &&
            this.minutesModel.id &&
            this.minutesModel.generalStatus === GeneralStatusEnum.DC_M_LAUNCHED
          ) {
            return this.investigationService.reviewTaskMeetingMinutes(
              this.investigationModel().taskDetails.tkiid,
              model.id,
              true,
            );
          } else if (!this.minutesModel) {
            return this.investigationService.addMeetingMinutes({
              ...model,
              ...this.form.value,
              caseId: model.caseId,
              id: model.id,
              attendanceList: model.attendanceList.map(attend => {
                return {
                  ...attend,
                  status: this.attendanceList.find(
                    localAttend => attend.attendeeId === localAttend.attendeeId,
                  )?.status,
                };
              }),
              offenderList: this.concernedOffendersIds,
            });
          } else {
            return of(null);
          }
        }),
      )
      .subscribe(() => {
        this.dialogRef.close();
      });
  }
}
