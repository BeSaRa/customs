import { Component, inject, OnInit } from '@angular/core';
import { AttendanceComponent } from '@standalone/components/attendance/attendance.component';
import { PenaltyDecisionForExternalUsersComponent } from '@standalone/components/penalty-decision-for-external-users/penalty-decision-for-external-users.component';
import { CasesForExternalUsersComponent } from '@standalone/components/cases-for-external-users/cases-for-external-users.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { EmployeeService } from '@services/employee.service';
import { MatIcon } from '@angular/material/icon';
import { AppIcons } from '@constants/app-icons';
import { MawaredEmployee } from '@models/mawared-employee';
import { ClearingAgent } from '@models/clearing-agent';
import { UserTypes } from '@enums/user-types';
import { ActivatedRoute, Router } from '@angular/router';
import { ClearingAgentService } from '@services/clearing-agent.service';

@Component({
  selector: 'app-external-home',
  standalone: true,
  imports: [
    AttendanceComponent,
    PenaltyDecisionForExternalUsersComponent,
    CasesForExternalUsersComponent,
    InputComponent,
    ReactiveFormsModule,
    IconButtonComponent,
    MatIcon,
  ],
  templateUrl: './external-home.component.html',
  styleUrl: './external-home.component.scss',
})
export class ExternalHomeComponent implements OnInit {
  lang = inject(LangService);
  employeeService = inject(EmployeeService);
  route = inject(ActivatedRoute);
  clearingAgentService = inject(ClearingAgentService);
  router = inject(Router);
  person = this.employeeService.getExternalPerson();
  agency = this.employeeService.getExternalClearingAgency();
  user = this.employeeService.getLoginData();
  casesLength: number = 0;
  penaltyDecisionLength: number = 0;
  attendancesLength: number = 0;
  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params.id) {
        this.loadAgentData(params.id);
      }
    });
  }
  loadAgentData(id: number) {
    this.clearingAgentService.loadByIdComposite(id).subscribe(rs => {
      this.person = rs;
    });
  }

  showAll(url: string) {
    this.router?.navigate([url]);
  }
  assertEmployee(item: MawaredEmployee | ClearingAgent | undefined) {
    return item as MawaredEmployee;
  }
  assertClearingAgent(item: MawaredEmployee | ClearingAgent | undefined) {
    return item as ClearingAgent;
  }
  protected readonly AppIcons = AppIcons;
  protected readonly UserTypes = UserTypes;
}
