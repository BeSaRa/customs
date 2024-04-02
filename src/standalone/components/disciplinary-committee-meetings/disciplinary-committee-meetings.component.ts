import { Component, inject, input, OnInit } from '@angular/core';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { Investigation } from '@models/investigation';
import { DialogService } from '@services/dialog.service';
import { MeetingService } from '@services/meeting.service';
import {
  BehaviorSubject,
  exhaustMap,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
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
import { OperationType } from '@enums/operation-type';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { ToastService } from '@services/toast.service';

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
export class DisciplinaryCommitteeMeetingsComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  lookupService = inject(LookupService);
  meetingService = inject(MeetingService);
  toast = inject(ToastService);
  model = input.required<Investigation>();
  dialog = inject(DialogService);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<Meeting> = new Subject<Meeting>();
  update$: Subject<Meeting> = new Subject<Meeting>();
  delete$: Subject<Meeting> = new Subject<Meeting>();
  dataList: Meeting[] = [];
  displayedColumns: string[] = ['title', 'meetingDate', 'note', 'actions'];
  ngOnInit(): void {
    this._listenToReload();
    this._listenToAddMeeting();
    this._listenToViewMeeting();
    this._listenToUpdateMeeting();
    this._listenToDelete();
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
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model: new Meeting(),
                operation: OperationType.CREATE,
                extras: {
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
          return this.dialog
            .open(ScheduleMeetingPopupComponent, {
              data: {
                model,
                operation: OperationType.UPDATE,
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

  _listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(model =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: model.title,
              }),
            )
            .afterClosed()
            .pipe(filter(value => value === UserClick.YES))
            .pipe(
              switchMap(() => {
                return model.delete().pipe(map(() => model));
              }),
            ),
        ),
      )
      .subscribe(model => {
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.getNames() }),
        );
        this.reload$.next(null);
      });
  }
}
