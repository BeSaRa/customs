import { Component, inject, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserClick } from '@enums/user-click';
import { InboxResult } from '@models/inbox-result';
import { InternalUser } from '@models/internal-user';
import { CommonService } from '@services/common.service';
import { InboxService } from '@services/inbox.services';
import { LangService } from '@services/lang.service';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { CustomValidators } from '@validators/custom-validators';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-reassign-task-popup',
  standalone: true,
  imports: [
    MatDialogModule,
    IconButtonComponent,
    ButtonComponent,
    MatTooltipModule,
    ReactiveFormsModule,
    SelectInputComponent,
  ],
  templateUrl: './reassign-task-popup.component.html',
  styleUrl: './reassign-task-popup.component.scss',
})
export class ReassignTaskPopupComponent implements OnInit {
  lang = inject(LangService);
  commonService = inject(CommonService);
  inboxService = inject(InboxService);
  dialogRef = inject(MatDialogRef);
  data: { tasks: InboxResult[]; departmentId: number; employeeId: number } =
    inject(MAT_DIALOG_DATA);

  employees: InternalUser[] = [];
  employeesControl = new FormControl<InternalUser | null>(null, {
    validators: [CustomValidators.required],
  });

  ngOnInit(): void {
    this.loadEmployeesToAssign();
  }

  loadEmployeesToAssign() {
    this.commonService
      .loadAvailableEmployeesToAssign(this.data.departmentId, this.data.tasks)
      .pipe(
        catchError(err => {
          this.dialogRef.close();
          return throwError(() => err);
        }),
      )
      .subscribe(res => {
        this.employees = res.filter(e => e.id !== this.data.employeeId);
      });
  }

  save() {
    if (!this.employeesControl.value) return;

    this.inboxService
      .reassignTasks(this.employeesControl.value.domainName, this.data.tasks)
      .subscribe(() => {
        this.dialogRef.close(UserClick.YES);
      });
  }
}
