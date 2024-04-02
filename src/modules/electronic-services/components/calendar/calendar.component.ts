import {
  Component,
  computed,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Meeting } from '@models/meeting';
import { MeetingService } from '@services/meeting.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatCalendar } from '@angular/material/datepicker';
import { DialogService } from '@services/dialog.service';
import { MeetingDetailsPopupComponent } from '@standalone/popups/meeting-details-popup/meeting-details-popup.component';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [MatTooltip, IconButtonComponent, DatePipe, MatCalendar],
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
  @ViewChild(MatCalendar) matCalendar!: MatCalendar<Date>;
  selectedDate = signal<Date | null>(null);
  filteredMeetings = computed(() => {
    return this.meetingsList()
      .filter(
        (meeting: Meeting) =>
          !this.selectedDate() ||
          (this.selectedDate()?.getFullYear() ===
            new Date(meeting.meetingDate).getFullYear() &&
            this.selectedDate()?.getMonth() ===
              new Date(meeting.meetingDate).getMonth() &&
            this.selectedDate()?.getDate() ===
              new Date(meeting.meetingDate).getDate()),
      )
      .sort((a, b) => +new Date(a.meetingDate) - +new Date(b.meetingDate));
  });
  ngOnInit(): void {
    this._listenToReload();
    this._listenToDetails();
  }
  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.meetingService.load();
        }),
      )
      .subscribe(res => {
        this.meetingsList.set(res.rs);
        this.matCalendar?.updateTodaysDate();
      });
  }
  _listenToDetails() {
    this.details$
      .pipe(
        switchMap((meeting: Meeting) => {
          return this.dialog
            .open(MeetingDetailsPopupComponent, { data: { model: meeting } })
            .afterClosed();
        }),
      )
      .subscribe();
  }
  isSelected = (event: Date) => {
    if (
      this.meetingsList().find(
        m =>
          new Date(m.meetingDate).getFullYear() === event.getFullYear() &&
          new Date(m.meetingDate).getMonth() === event.getMonth() &&
          new Date(m.meetingDate).getDate() === event.getDate(),
      )
    )
      return ['selected'];
    return [];
  };
  handleDateChange($event: Date | null) {
    this.selectedDate.set($event);
  }
}
