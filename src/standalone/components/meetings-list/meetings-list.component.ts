import { Component, inject, input, OnInit } from '@angular/core';
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
import { LDAPGroupNames } from '@enums/department-group-names.enum';

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
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<Meeting> = new Subject<Meeting>();
  update$: Subject<Meeting> = new Subject<Meeting>();
  model = input.required<Investigation>();
  lang = inject(LangService);
  dialog = inject(DialogService);
  dataList: Meeting[] = [];
  displayedColumns: string[] = ['title', 'meetingDate', 'note', 'actions'];
  ngOnInit(): void {
    this._listenToReload();
    this._listenToUpdateMeeting();
    this._listenToAddMeeting();
    this._listenToViewMeeting();
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

  protected readonly LDAPGroupNames = LDAPGroupNames;
}
