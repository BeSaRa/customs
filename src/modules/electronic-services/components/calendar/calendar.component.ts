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
  ],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  lang = inject(LangService);
  meetingService = inject(MeetingService);
  lookupService = inject(LookupService);
  dialog = inject(DialogService);
  meetingsList = signal<Meeting[]>([] as Meeting[]);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  details$: Subject<Meeting> = new Subject();
  update$: Subject<Meeting> = new Subject<Meeting>();
  config = Config;
  calendarFormat = this.lookupService.lookups.calendarFormat;
  selectedCalendarFormat = new FormControl(CalendarFormats.MONTH, {
    nonNullable: true,
  });
  protected readonly meetingStatusEnum = MeetingStatusEnum;

  @ViewChild('calendarComponent') calendar!: FullCalendarComponent;

  ngOnInit(): void {
    this._listenToReload();
    this._listenToDetails();
    this._listenToUpdateMeeting();
    this.setMeetingsOnCalendar();
    this.onSelectedCalendarFormatChanges();
    this.onLangChanges();
  }

  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.meetingService.load({});
        }),
      )
      .subscribe(list => {
        this.meetingsList.set(list.rs);
        this.setMeetingsOnCalendar();
      });
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
                extras: {
                  caseId: meeting.caseId,
                },
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
      });
  }

  isExpiredMeetingDate(meetingDate: Date) {
    return +new Date() >= +new Date(meetingDate);
  }

  calendarOptions: CalendarOptions = {
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

  handleViewMeeting(arg: EventClickArg) {
    this.details$.next(Object.assign(new Meeting(), arg.event.extendedProps));
  }

  handleEditMeeting(event: MouseEvent, arg: Meeting) {
    event.stopPropagation();
    this.update$.next(Object.assign(new Meeting(), arg));
  }

  setMeetingsOnCalendar() {
    const events = this.meetingsList().map(meeting => {
      return {
        title: meeting.title,
        date: new Date(meeting.meetingDate),
        extendedProps: {
          ...meeting,
        },
      };
    });
    this.calendarOptions = {
      ...this.calendarOptions,
      events,
    };
  }

  onLangChanges() {
    this.lang.change$.subscribe(lang => {
      this.calendarOptions.direction = lang.direction;
      this.calendarOptions.locale = lang.code;
    });
  }

  onSelectedCalendarFormatChanges() {
    this.selectedCalendarFormat.valueChanges.subscribe(value => {
      if (value === CalendarFormats.DAY) {
        this.calendar.getApi().changeView('dayGridDay');
      } else if (
        value === CalendarFormats.WEEK ||
        value === CalendarFormats.WORK_WEEK
      ) {
        this.calendar.getApi().changeView('dayGridWeek');
      } else if (value === CalendarFormats.MONTH) {
        this.calendar.getApi().changeView('dayGridMonth');
      } else if (value === CalendarFormats.YEAR) {
        this.calendar.getApi().changeView('dayGridYear');
      }
      if (value === CalendarFormats.WORK_WEEK) {
        this.calendarOptions.hiddenDays = [5, 6];
      } else {
        this.calendarOptions.hiddenDays = [];
      }
    });
  }
}
