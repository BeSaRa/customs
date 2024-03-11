import { Component, inject, OnInit } from '@angular/core';
import { MatTooltip } from '@angular/material/tooltip';
import { LangService } from '@services/lang.service';
import { Meeting } from '@models/meeting';
import { MeetingService } from '@services/meeting.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { BehaviorSubject, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatCalendar } from '@angular/material/datepicker';

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
  meetingsList: Meeting[] = [];
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);

  ngOnInit(): void {
    this._listenToReload();
  }
  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.meetingService.load();
        }),
      )
      .subscribe(res => {
        this.meetingsList = res.rs;
      });
  }
  isSelected = (event: Date) => {
    if (this.meetingsList.map(m => +m.meetingDate).indexOf(+event) !== -1)
      return ['selected'];
    return [];
  };
}
