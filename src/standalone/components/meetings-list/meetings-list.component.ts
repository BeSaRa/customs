import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import { MeetingService } from '@services/meeting.service';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { Meeting } from '@models/meeting';
import { Investigation } from '@models/investigation';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { ScheduleMeetingPopupComponent } from '@standalone/popups/schedule-meeting-popup/schedule-meeting-popup.component';
import { OperationType } from '@enums/operation-type';
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
import { EmployeeService } from '@services/employee.service';
import { Config } from '@constants/config';
import { MeetingStatusEnum } from '@enums/meeting-status-enum';
import { MeetingMinutesPopupComponent } from '@standalone/popups/meeting-minutes-popup/meeting-minutes-popup.component';
import { MeetingMinutes } from '@models/meeting-minutes';

@Component({
  selector: 'app-meetings-list',
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
  templateUrl: './meetings-list.component.html',
  styleUrl: './meetings-list.component.scss',
})
export class MeetingsListComponent implements OnInit {
  meetingService = inject(MeetingService);
  employeeService = inject(EmployeeService);
  MeetingStatusEnum = MeetingStatusEnum;
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  addMeetingMinutes$: Subject<Meeting | undefined> = new Subject<
    Meeting | undefined
  >();
  view$: Subject<Meeting> = new Subject<Meeting>();
  update$: Subject<Meeting> = new Subject<Meeting>();
  model = input.required<Investigation>();
  lang = inject(LangService);
  dialog = inject(DialogService);
  dataList: Meeting[] = [];
  @Output()
  askToReloadMeetingMinutes: EventEmitter<void> = new EventEmitter<void>();
  @Input()
  readonly: boolean = false;
  @Input()
  meetingMinutesList: MeetingMinutes[] = [];
  displayedColumns: string[] = [
    'title',
    'place',
    'meetingDate',
    'meetingTime',
    'status',
    'note',
    'actions',
  ];
  config = Config;
  ngOnInit(): void {
    this._listenToReload();
    this._listenToUpdateMeeting();
    this._listenToAddMeeting();
    this._listenToViewMeeting();
    this._listenToAddMeetingMinutes();
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
        this.dataList = res.rs.sort((a, b) => +b.meetingDate - +a.meetingDate);
      });
  }
  _listenToAddMeeting() {
    this.add$
      .pipe(
        switchMap(() => {
          const maxDate = new Date(this.model().taskDetails.dueTime);
          maxDate.setDate(maxDate.getDate() + 14);
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model: new Meeting(),
                operation: OperationType.CREATE,
                extras: {
                  caseId: this.model().id,
                  concernedOffendersIds:
                    this.model().getConcernedOffendersIds(),
                  maxDate,
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
  _listenToUpdateMeeting() {
    this.update$
      .pipe(
        switchMap(model => {
          const maxDate = new Date(this.model().taskDetails.dueTime);
          maxDate.setDate(maxDate.getDate() + 14);
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model,
                operation: OperationType.UPDATE,
                extras: {
                  caseId: this.model().id,
                  maxDate,
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

  _listenToViewMeeting() {
    this.view$
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model,
                operation: OperationType.VIEW,
                extras: {
                  caseId: this.model().id,
                  showOffenders: true,
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

  _listenToAddMeetingMinutes() {
    this.addMeetingMinutes$
      .pipe(
        switchMap(meeting => {
          return this.dialog
            .open(MeetingMinutesPopupComponent, {
              data: {
                model: meeting,
                extras: {
                  readonly: true,
                  caseId: this.model().id,
                  concernedOffendersIds:
                    this.model().getConcernedOffendersIds(),
                },
              },
            })
            .afterClosed();
        }),
      )
      .subscribe(() => {
        this.askToReloadMeetingMinutes.emit();
      });
  }
  hasNotHaveMeetingMinutes(id: number) {
    return !this.meetingMinutesList.find(minutes => minutes.concernedId === id);
  }
}
