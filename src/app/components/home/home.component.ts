import { Component, inject } from '@angular/core';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  employeeService = inject(EmployeeService);
  // permissionService = inject(PermissionService)
  //   .generateAppPermission()
  //   .subscribe(console.log);
}
