import { Component, inject, OnInit, signal } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Meeting } from '@models/meeting';
import { MeetingService } from '@services/meeting.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { BehaviorSubject, map, Subject, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { DialogService } from '@services/dialog.service';
import { ScheduleMeetingPopupComponent } from '@standalone/popups/schedule-meeting-popup/schedule-meeting-popup.component';
import { OperationType } from '@enums/operation-type';
import { Config } from '@constants/config';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventClickArg } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MatTooltip, IconButtonComponent, DatePipe, FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent implements OnInit {
  lang = inject(LangService);
  meetingService = inject(MeetingService);
  dialog = inject(DialogService);
  meetingsList = signal<Meeting[]>([] as Meeting[]);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  details$: Subject<Meeting> = new Subject();
  update$: Subject<Meeting> = new Subject<Meeting>();
  config = Config;

  ngOnInit(): void {
    this._listenToReload();
    this._listenToDetails();
    this._listenToUpdateMeeting();
    this.setMeetingsOnCalendar();
  }

  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.meetingService.load();
        }),
        map(list => {
          return list.rs.filter(meeting => !this.isMeetingEnd(meeting));
        }),
      )
      .subscribe(res => {
        this.meetingsList.set(res);
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

  isMeetingEnd(meeting: Meeting) {
    return +new Date() > +new Date(meeting.meetingDate);
  }

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin, timeGridPlugin],
    eventClick: arg => this.handleViewMeeting(arg),
    headerToolbar: {
      start: 'today prev,next',
      center: 'title',
      end: '',
    },
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
        eventTimeFormat: {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        },
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
}
