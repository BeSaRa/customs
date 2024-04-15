import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import { filter, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Meeting } from '@models/meeting';
import { ControlDirective } from '@standalone/directives/control.directive';
import { InputComponent } from '@standalone/components/input/input.component';
import {
  MatDatepicker,
  MatDatepickerInput,
} from '@angular/material/datepicker';
import {
  NgxMatTimepickerComponent,
  NgxMatTimepickerDirective,
} from 'ngx-mat-timepicker';
import { MeetingAttendanceListComponent } from '@standalone/components/meeting-attendance-list/meeting-attendance-list.component';
import { InvestigationService } from '@services/investigation.service';
import { CustomValidators } from '@validators/custom-validators';
import { DialogService } from '@services/dialog.service';
import { LookupService } from '@services/lookup.service';
import { MeetingAttendance } from '@models/meeting-attendance';
import { TeamService } from '@services/team.service';
import { TeamNames } from '@enums/team-names';
import { InternalUser } from '@models/internal-user';
import { AdminResult } from '@models/admin-result';
import { MeetingService } from '@services/meeting.service';

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
  meetingService = inject(MeetingService);
  save$: Subject<void> = new Subject<void>();
  form: FormGroup = new FormGroup({});
  todayDate = new Date();
  maxDate = this.data.extras?.maxDate;
  caseId = this.data.extras?.caseId;
  model: Meeting | undefined = this.data.model;
  attendanceList: MeetingAttendance[] = [];
  concernedOffendersIds = this.data.extras?.concernedOffendersIds;
  meetingStatus = this.lookupService.lookups.meetingStatus;
  ngOnInit(): void {
    this.buildForm();
    this.listenToSave();
    this.getAttendanceList();
  }
  get readonlyMeetingData() {
    return !!this.model;
  }
  getAttendanceList() {
    this.teamService
      .loadTeamMembers(TeamNames.Disciplinary_Committee)
      .pipe(
        map((users: InternalUser[]) => {
          return users.map((user: InternalUser) => {
            return new MeetingAttendance().clone<MeetingAttendance>({
              attendeeId: user.id,
              attendeeInfo: AdminResult.createInstance({
                id: user.id,
                arName: user.arName,
                enName: user.enName,
              }),
              status: 0,
            });
          });
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
    if (!this.model) {
      this.form.get('status')?.disable();
    }
  }
  listenToSave() {
    this.save$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        tap(
          () =>
            this.form.invalid &&
            this.dialog.error(
              this.lang.map.msg_make_sure_all_required_fields_are_filled,
            ),
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
          if (!this.model) {
            return this.meetingService.createFull(
              new Meeting().clone<Meeting>({
                caseId: this.caseId,
                ...this.form.value,
                offenderList: this.concernedOffendersIds,
              }),
            );
          } else {
            return of(this.model);
          }
        }),
      )
      .pipe(
        switchMap(model => {
          return this.investigationService.addMeetingMinutes({
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
        }),
      )
      .subscribe(model => {
        this.dialogRef.close(model);
      });
  }
}
