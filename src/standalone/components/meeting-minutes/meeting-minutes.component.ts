import { Component, inject, input, OnInit } from '@angular/core';
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
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { ToastService } from '@services/toast.service';
import { Investigation } from '@models/investigation';
import { DialogService } from '@services/dialog.service';
import { EmployeeService } from '@services/employee.service';
import { BehaviorSubject, Subject, switchMap } from 'rxjs';
import { Meeting } from '@models/meeting';
import { MeetingMinutesPopupComponent } from '@standalone/popups/meeting-minutes-popup/meeting-minutes-popup.component';
import { MatTooltip } from '@angular/material/tooltip';
import { MatSort } from '@angular/material/sort';
import { Config } from '@constants/config';

@Component({
  selector: 'app-meeting-minutes',
  standalone: true,
  imports: [
    DatePipe,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatTooltip,
    MatHeaderCellDef,
    MatTable,
    MatSort,
    MatHeaderRow,
    MatRow,
    MatRowDef,
    MatHeaderRowDef,
    MatNoDataRow,
  ],
  templateUrl: './meeting-minutes.component.html',
  styleUrl: './meeting-minutes.component.scss',
})
export class MeetingMinutesComponent implements OnInit {
  lang = inject(LangService);
  lookupService = inject(LookupService);
  toast = inject(ToastService);
  model = input.required<Investigation>();
  dialog = inject(DialogService);
  employeeService = inject(EmployeeService);
  config = Config;
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<Meeting> = new Subject<Meeting>();
  update$: Subject<Meeting> = new Subject<Meeting>();
  dataList: Meeting[] = [];
  displayedColumns: string[] = [
    'title',
    'place',
    'meetingDate',
    'note',
    'actions',
  ];
  ngOnInit(): void {
    this._listenToAddMeetingMinutes();
  }
  _listenToAddMeetingMinutes() {
    this.add$
      .pipe(
        switchMap(() => {
          return this.dialog
            .open(MeetingMinutesPopupComponent, {
              data: {
                model: new Meeting(),
                extras: {
                  caseId: this.model().id,
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
}
