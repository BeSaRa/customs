import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonService } from '@services/common.service';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  employeeService = inject(EmployeeService);

  private _commonService = inject(CommonService);

  ngOnInit(): void {
    this._commonService.startPolling();
  }

  ngOnDestroy(): void {
    this._commonService.stopPolling();
  }
}
