import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
import {
  BehaviorSubject,
  exhaustMap,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { Investigation } from '@models/investigation';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
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
import { MeetingMinutesPopupComponent } from '@standalone/popups/meeting-minutes-popup/meeting-minutes-popup.component';
import { InvestigationService } from '@services/investigation.service';
import { Config } from '@constants/config';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { UserClick } from '@enums/user-click';
import { ignoreErrors } from '@utils/utils';
import { ToastService } from '@services/toast.service';
import { combineLatest } from 'rxjs';
import { MeetingMinutes } from '@models/meeting-minutes';
import { GeneralStatusEnum } from '@enums/general-status-enum';
import { OperationType } from '@enums/operation-type';
import { MeetingService } from '@services/meeting.service';

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
  templateUrl: './meeting-minutes.component.html',
  styleUrl: './meeting-minutes.component.scss',
})
export class MeetingMinutesComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  employeeService = inject(EmployeeService);
  lang = inject(LangService);
  dialog = inject(DialogService);
  investigationService = inject(InvestigationService);
  toast = inject(ToastService);
  meetingService = inject(MeetingService);
  reload$: BehaviorSubject<null> = new BehaviorSubject<null>(null);
  add$: Subject<void> = new Subject<void>();
  view$: Subject<MeetingMinutes> = new Subject<MeetingMinutes>();
  delete$: Subject<MeetingMinutes> = new Subject<MeetingMinutes>();
  launch$: Subject<MeetingMinutes> = new Subject<MeetingMinutes>();
  model = input.required<Investigation>();
  dataList: MeetingMinutes[] = [];
  config = Config;
  displayedColumns: string[] = [
    'meeting',
    'status',
    'creationDate',
    'creator',
    'actions',
  ];
  @Input()
  readonly: boolean = false;
  @Output()
  updateMeetingMinutesList: EventEmitter<MeetingMinutes[]> = new EventEmitter<
    MeetingMinutes[]
  >();
  generalStatusEnum = GeneralStatusEnum;
  ngOnInit(): void {
    this._listenToReload();
    this._listenToLaunch();
    this.listenToDelete();
    this.listenToView();
    this._listenToAddMeetingMinutes();
  }
  _listenToReload() {
    this.reload$
      .pipe(
        switchMap(() => {
          return this.investigationService.getMeetingsMinutes(this.model().id);
        }),
      )
      .subscribe(res => {
        this.dataList = res;
        this.updateMeetingMinutesList.emit(res);
      });
  }

  _listenToLaunch() {
    this.launch$
      .pipe(
        switchMap(draft => {
          return combineLatest(
            draft.offenderIds.map(offenderId => {
              return this.investigationService.reviewTaskMeetingMinutes(
                this.model().taskDetails.tkiid,
                draft.concernedId,
                offenderId,
              );
            }),
          );
        }),
      )
      .subscribe(() => {
        this.reload$.next(null);
      });
  }
  private listenToDelete() {
    this.delete$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        exhaustMap(item => {
          return this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x:
                  item.meetingInfo?.getNames() +
                  ' - ' +
                  new Date(item.createdOn).toLocaleDateString('GB-en'),
              }),
            )
            .afterClosed()
            .pipe(
              map(userClick => {
                return { userClick: userClick, item };
              }),
            );
        }),
      )
      .pipe(filter(response => response.userClick === UserClick.YES))
      .pipe(
        exhaustMap(response =>
          response.item
            .delete(this.investigationService)
            .pipe(ignoreErrors())
            .pipe(map(() => response.item)),
        ),
      )
      .pipe(
        tap(item =>
          this.toast.success(
            this.lang.map.msg_delete_x_success.change({
              x:
                item.meetingInfo?.getNames() +
                ' - ' +
                new Date(item.createdOn).toLocaleDateString('GB-en'),
            }),
          ),
        ),
      )
      .subscribe(() => this.reload$.next(null));
  }
  _listenToAddMeetingMinutes() {
    this.add$
      .pipe(
        switchMap(() => {
          return this.dialog
            .open(MeetingMinutesPopupComponent, {
              data: {
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
  listenToView() {
    this.view$
      .pipe(
        switchMap(model => {
          return this.meetingService.loadByIdComposite(model.concernedId);
        }),
      )
      .pipe(
        switchMap(model => {
          return this.dialog
            .open(MeetingMinutesPopupComponent, {
              data: {
                model,
                extras: {
                  operation: OperationType.VIEW,
                },
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
}
