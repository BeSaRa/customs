import { Component, inject, input, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { Investigation } from '@models/investigation';
import { DialogService } from '@services/dialog.service';
import { MeetingService } from '@services/meeting.service';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { Meeting } from '@models/meeting';
import { DatePipe } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTooltip } from '@angular/material/tooltip';
import { ScheduleMeetingPopupComponent } from '@standalone/popups/schedule-meeting-popup/schedule-meeting-popup.component';

@Component({
  selector: 'app-disciplinary-committee-meetings',
  standalone: true,
  imports: [
    DatePipe,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatTable,
    MatSort,
    MatHeaderCellDef,
    MatTooltip,
    MatHeaderRow,
    MatRowDef,
    MatHeaderRowDef,
    MatRow,
    MatNoDataRow,
  ],
  templateUrl: './disciplinary-committee-meetings.component.html',
  styleUrl: './disciplinary-committee-meetings.component.scss',
})
export class DisciplinaryCommitteeMeetingsComponent implements OnInit {
  lang = inject(LangService);
  lookupService = inject(LookupService);
  meetingService = inject(MeetingService);
  model = input.required<Investigation>();
  dialog = inject(DialogService);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<Meeting> = new Subject<Meeting>();
  edit$: Subject<Meeting> = new Subject<Meeting>();
  delete$: Subject<Meeting> = new Subject<Meeting>();
  dataList: Meeting[] = [];
  displayedColumns: string[] = ['actions'];
  ngOnInit(): void {
    this._listenToReload();
    this._listenToAddMeeting();
  }
  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.meetingService.load(undefined, {
            caseId: this.model().id,
          });
        }),
      )
      .subscribe(res => {
        this.dataList = res.rs;
      });
  }

  _listenToAddMeeting() {
    this.add$
      .pipe(
        switchMap(() => {
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model: new Meeting(),
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {});
  }
}
