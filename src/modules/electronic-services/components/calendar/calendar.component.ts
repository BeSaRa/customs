import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Meeting } from '@models/meeting';
import { MeetingService } from '@services/meeting.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { DatePipe, NgClass } from '@angular/common';
import { DialogService } from '@services/dialog.service';
import { ScheduleMeetingPopupComponent } from '@standalone/popups/schedule-meeting-popup/schedule-meeting-popup.component';
import { OperationType } from '@enums/operation-type';
import { Config } from '@constants/config';
import {
  FullCalendarComponent,
  FullCalendarModule,
} from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LookupService } from '@services/lookup.service';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { CalendarFormats } from '@enums/calendar-formats';
import { MeetingStatusEnum } from '@enums/meeting-status-enum';
import { EmployeeService } from '@services/employee.service';
import { TeamNames } from '@enums/team-names';
import { CallRequestService } from '@services/call-request.service';
import { CallRequest } from '@models/call-request';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { Offender } from '@models/offender';
import { OffenderTypes } from '@enums/offender-types';
import { Witness } from '@models/witness';
import { WitnessTypes } from '@enums/witness-types';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    MatTooltip,
    IconButtonComponent,
    DatePipe,
    FullCalendarModule,
    NgClass,
    SelectInputComponent,
    ReactiveFormsModule,
    MatTab,
    MatTabGroup,
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  lang = inject(LangService);
  meetingService = inject(MeetingService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  callRequestService = inject(CallRequestService);
  meetingsList = signal<Meeting[]>([]);
  callRequestsList = signal<CallRequest[]>([]);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  details$: Subject<Meeting> = new Subject();
  callRequestDetails$: Subject<CallRequest> = new Subject();
  update$: Subject<Meeting> = new Subject();
  config = Config;
  calendarFormat = this.lookupService.lookups.calendarFormat;
  selectedCalendarFormat = new FormControl(CalendarFormats.MONTH, {
    nonNullable: true,
  });
  protected readonly meetingStatusEnum = MeetingStatusEnum;

  @ViewChild('meetingCalendarComponent')
  meetingCalendar?: FullCalendarComponent;
  @ViewChild('callRequestCalendarComponent')
  callRequestCalendar?: FullCalendarComponent;

  ngOnInit(): void {
    this._listenToReload();
    this._listenToDetails();
    this._listenToUpdateMeeting();
    this.reload$.next(null);
    this.onSelectedCalendarFormatChanges();
    this.onLangChanges();
    setTimeout(() => {
      if (this.hasDisciplinaryTeam) {
        this.meetingCalendar?.getApi()?.render();
      }
      if (this.hasManageObligationToAttendPermission) {
        this.callRequestCalendar?.getApi()?.render();
      }
    }, 1);
  }

  get hasDisciplinaryTeam() {
    return this.employeeService
      .getEmployeeTeams()
      .some(team => team.authName === TeamNames.Disciplinary_Committee);
  }

  get hasManageObligationToAttendPermission() {
    return this.employeeService.hasPermissionTo('MANAGE_OBLIGATION_TO_ATTEND');
  }

  _listenToReload() {
    if (this.hasDisciplinaryTeam) {
      this.reload$
        .pipe(switchMap(() => this.meetingService.load({})))
        .subscribe((list: { rs: Meeting[] }) => {
          this.meetingsList.set(list.rs);
          this.setMeetingsOnCalendar();
        });
    }

    if (this.hasManageObligationToAttendPermission) {
      this.reload$
        .pipe(
          switchMap(() =>
            this.callRequestService.load(undefined, {
              createdByOUId: this.employeeService.getOrganizationUnit()?.id,
            }),
          ),
        )
        .subscribe((list: { rs: CallRequest[] }) => {
          this.callRequestsList.set(list.rs);
          this.setCallRequestsOnCalendar();
        });
    }
  }

  _listenToDetails() {
    this.details$
      .pipe(
        switchMap((meeting: Meeting) => {
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model: meeting,
                operation: OperationType.VIEW,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
    this.callRequestDetails$
      .pipe(
        switchMap(callRequest => {
          return callRequest
            .openView({
              ...(callRequest.summonedType
                ? {
                    offender: new Offender().clone<Offender>({
                      ...callRequest.summonInfo,
                      caseId: callRequest.caseId,
                      enName: callRequest.summonInfo.enName,
                      arName: callRequest.summonInfo.enName,
                      type: OffenderTypes.EMPLOYEE,
                      status: 1,
                      ouId: callRequest.summonInfo.employeeDepartmentId,
                    }),
                  }
                : {
                    witness: new Witness().clone<Witness>({
                      ...callRequest.summonInfo,
                      caseId: callRequest.caseId,
                      enName: callRequest.summonInfo.enName,
                      arName: callRequest.summonInfo.enName,
                      witnessType: WitnessTypes.CLEARING_AGENT,
                      status: 1,
                    }),
                  }),
              caseId: callRequest.caseId,
              cameFromCalendar: true,
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }

  _listenToUpdateMeeting() {
    this.update$
      .pipe(
        switchMap(meeting => {
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model: meeting,
                operation: OperationType.UPDATE,
                extras: { caseId: meeting.caseId },
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
      });
  }

  isExpiredDate(meetingDate: Date) {
    return +new Date() >= +new Date(meetingDate);
  }

  meetingCalendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    eventClick: arg => this.handleViewMeeting(arg),
    headerToolbar: {
      start: 'prev,next',
      center: 'title',
      end: '',
    },
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    locale: this.lang.getCurrent().code,
    direction: this.lang.getCurrent().direction,
  };

  callRequestsCalendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    eventClick: arg => this.handleViewCallRequest(arg),
    headerToolbar: {
      start: 'prev,next',
      center: 'title',
      end: '',
    },
    titleFormat: { year: 'numeric', month: 'long', day: 'numeric' },
    locale: this.lang.getCurrent().code,
    direction: this.lang.getCurrent().direction,
  };

  handleViewMeeting(arg: EventClickArg) {
    this.details$.next(Object.assign(new Meeting(), arg.event.extendedProps));
  }
  handleViewCallRequest(arg: EventClickArg) {
    this.callRequestDetails$.next(
      Object.assign(new CallRequest(), arg.event.extendedProps),
    );
  }

  handleEditMeeting(event: MouseEvent, arg: Meeting) {
    event.stopPropagation();
    this.update$.next(Object.assign(new Meeting(), arg));
  }

  setMeetingsOnCalendar() {
    const events = this.meetingsList().map(meeting => ({
      title: meeting.title,
      date: new Date(meeting.meetingDate),
      extendedProps: { ...meeting },
    }));
    this.meetingCalendarOptions = {
      ...this.meetingCalendarOptions,
      events,
    };
  }

  setCallRequestsOnCalendar() {
    const events = this.callRequestsList().map(callRequest => ({
      title: callRequest.note,
      date: new Date(callRequest.summonDate),
      extendedProps: { ...callRequest },
    }));
    this.callRequestsCalendarOptions = {
      ...this.callRequestsCalendarOptions,
      events,
    };
  }

  onLangChanges() {
    this.lang.change$.subscribe(lang => {
      this.meetingCalendarOptions.direction = lang.direction;
      this.meetingCalendarOptions.locale = lang.code;
      this.callRequestsCalendarOptions.direction = lang.direction;
      this.callRequestsCalendarOptions.locale = lang.code;
    });
  }

  onSelectedCalendarFormatChanges() {
    this.selectedCalendarFormat.valueChanges.subscribe(value => {
      if (value === CalendarFormats.DAY) {
        this.meetingCalendar?.getApi()?.changeView('dayGridDay');
        this.callRequestCalendar?.getApi()?.changeView('dayGridDay');
      } else if (
        value === CalendarFormats.WEEK ||
        value === CalendarFormats.WORK_WEEK
      ) {
        this.meetingCalendar?.getApi()?.changeView('dayGridWeek');
        this.callRequestCalendar?.getApi()?.changeView('dayGridWeek');
      } else if (value === CalendarFormats.MONTH) {
        this.meetingCalendar?.getApi()?.changeView('dayGridMonth');
        this.callRequestCalendar?.getApi()?.changeView('dayGridMonth');
      } else if (value === CalendarFormats.YEAR) {
        this.meetingCalendar?.getApi()?.changeView('dayGridYear');
        this.callRequestCalendar?.getApi()?.changeView('dayGridYear');
      }

      if (value === CalendarFormats.WORK_WEEK) {
        this.meetingCalendarOptions.hiddenDays = [5, 6];
        this.callRequestsCalendarOptions.hiddenDays = [5, 6];
      } else {
        this.meetingCalendarOptions.hiddenDays = [];
        this.callRequestsCalendarOptions.hiddenDays = [];
      }
    });
  }

  onTabChange(index: number) {
    setTimeout(() => {
      if (index === 0 && this.hasDisciplinaryTeam) {
        this.meetingCalendar?.getApi()?.render();
      } else if (index === 1 && this.hasManageObligationToAttendPermission) {
        this.callRequestCalendar?.getApi()?.render();
      }
    });
  }
}
