import { Component, computed, inject, Input, input } from '@angular/core';
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
  MatTableDataSource,
} from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { DialogService } from '@services/dialog.service';
import { ToastService } from '@services/toast.service';
import { LangService } from '@services/lang.service';
import { LookupService } from '@services/lookup.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MatTooltip } from '@angular/material/tooltip';
import { CallRequest } from '@models/call-request';
import { DatePipe } from '@angular/common';
import { MatPaginator } from '@angular/material/paginator';
import { MeetingAttendance } from '@models/meeting-attendance';
import { Config } from '@constants/config';
import { ButtonComponent } from '@standalone/components/button/button.component';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
} from '@angular/forms';
import { SwitchComponent } from '@standalone/components/switch/switch.component';
import { MeetingService } from '@services/meeting.service';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-meeting-attendance-list',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatHeaderCell,
    MatSort,
    MatTable,
    MatTooltip,
    MatRow,
    MatHeaderRow,
    MatNoDataRow,
    MatHeaderRowDef,
    MatRowDef,
    MatHeaderCellDef,
    DatePipe,
    MatPaginator,
    ButtonComponent,
    ReactiveFormsModule,
    SwitchComponent,
  ],
  templateUrl: './meeting-attendance-list.component.html',
  styleUrl: './meeting-attendance-list.component.scss',
})
export class MeetingAttendanceListComponent extends OnDestroyMixin(class {}) {
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  meetingService = inject(MeetingService);
  dataSource: MatTableDataSource<CallRequest> = new MatTableDataSource();
  attendances = input([] as MeetingAttendance[]);
  @Input()
  meetingMinutes: boolean = false;
  @Input()
  meetingId!: number;
  protected readonly config = Config;
  attendancesFormGroup = computed<
    FormGroup<{ [key: string]: AbstractControl }>
  >(() => {
    const formGroup = new FormGroup({});
    this.attendances().forEach(attend => {
      formGroup.addControl(
        attend.id.toString(),
        new FormControl(attend.status),
      );
    });
    return formGroup;
  });
  getControl(attendanceId: number) {
    return this.attendancesFormGroup().get(
      attendanceId.toString(),
    ) as FormControl;
  }
  changeAttendanceAttendStatus(attendanceId: number, currentStatus: number) {
    of(null)
      .pipe(
        switchMap(() => {
          if (currentStatus) {
            return this.meetingService.setNotAttended(
              this.meetingId,
              attendanceId,
            );
          } else {
            return this.meetingService.setAttended(
              this.meetingId,
              attendanceId,
            );
          }
        }),
      )
      .subscribe();
  }
}
