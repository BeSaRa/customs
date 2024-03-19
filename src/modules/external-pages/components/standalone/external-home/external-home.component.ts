import { Component } from '@angular/core';
import { AttendanceComponent } from '@standalone/components/attendance/attendance.component';
import { PenaltyDecisionForExternalUsersComponent } from '@standalone/components/penalty-decision-for-external-users/penalty-decision-for-external-users.component';
import { CasesForExternalUsersComponent } from '@standalone/components/cases-for-external-users/cases-for-external-users.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-external-home',
  standalone: true,
  imports: [
    AttendanceComponent,
    PenaltyDecisionForExternalUsersComponent,
    CasesForExternalUsersComponent,
    InputComponent,
    ReactiveFormsModule,
  ],
  templateUrl: './external-home.component.html',
  styleUrl: './external-home.component.scss',
})
export class ExternalHomeComponent {}
