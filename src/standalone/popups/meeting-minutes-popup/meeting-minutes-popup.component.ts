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
import { filter, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Meeting } from '@models/meeting';
import { MeetingService } from '@services/meeting.service';
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
import { MeetingStatusEnum } from '@enums/meeting-status-enum';

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
  meetingService = inject(MeetingService);
  investigationService = inject(InvestigationService);
  fb = inject(FormBuilder);
  dialog = inject(DialogService);
  lookupService = inject(LookupService);
  save$: Subject<void> = new Subject<void>();
  saveMeeting$: Subject<void> = new Subject<void>();
  form: FormGroup = new FormGroup({});
  meetings: Meeting[] = [];
  selectedMeeting: Meeting | undefined;
  todayDate = new Date();
  maxDate = this.data.extras?.maxDate;
  concernedOffendersIds = this.data.extras?.concernedOffendersIds;
  meetingStatus = this.lookupService.lookups.meetingStatus.filter(
    s => s.lookupKey !== MeetingStatusEnum.pending,
  );
  ngOnInit(): void {
    this.buildForm();
    this.listenToSave();
    this.loadMeetings();
    this.listenToSaveMeeting();
  }
  buildForm() {
    this.form = this.fb.group(new Meeting().buildForm(true));
    this.form
      .get('meetingMinutesText')
      ?.setValidators([CustomValidators.required]);
    this.form.get('status')?.setValidators([CustomValidators.required]);
  }
  loadMeetings() {
    this.meetingService.loadAsLookups().subscribe((rs: Meeting[]) => {
      this.meetings = rs;
    });
  }
  handleSelectMeeting(meeting: unknown) {
    this.form.reset();
    this.meetingService
      .loadByIdComposite((meeting as Meeting).id)
      .subscribe(res => {
        this.selectedMeeting = new Meeting().clone<Meeting>(res);
        this.form.patchValue({
          title: this.selectedMeeting.title,
          note: this.selectedMeeting.note,
          meetingDate: this.selectedMeeting.meetingDate,
          place: this.selectedMeeting.place,
          meetingTimeFrom: this.selectedMeeting.meetingTimeFrom,
          meetingTimeTo: this.selectedMeeting.meetingTimeTo,
        });
      });
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
      .pipe(filter(() => this.form.valid))
      .pipe(
        switchMap(() => {
          return this.investigationService.addMeetingMinutes({
            ...this.form.value,
            caseId: this.selectedMeeting?.caseId,
            // offenderList: this.selectedMeeting?.offenderList,
          });
        }),
      )
      .subscribe(model => {
        this.dialogRef.close(model);
      });
  }
  listenToSaveMeeting() {
    this.saveMeeting$
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
      .pipe(filter(() => this.form.valid))
      .pipe(
        switchMap(() => {
          return new Meeting()
            .clone<Meeting>({
              ...this.form.value,
              caseId: this.selectedMeeting?.caseId,
              offenderList: this.concernedOffendersIds,
            })
            .save();
        }),
      )
      .subscribe(meeting => {
        this.meetings.push(meeting);
        this.handleSelectMeeting(meeting);
      });
  }
  protected readonly Meeting = Meeting;
}
