import { Component, inject, input } from '@angular/core';
import { Investigation } from '@models/investigation';
import { EmployeeService } from '@services/employee.service';
import { PersonsListComponent } from '@standalone/components/legal-affairs-offenders/persons-list.component';

@Component({
  selector: 'app-call-requests',
  standalone: true,
  imports: [PersonsListComponent],
  templateUrl: './call-requests.component.html',
  styleUrl: './call-requests.component.scss',
})
export class CallRequestsComponent {
  model = input.required<Investigation>();
  // @Input() model!: Investigation;
  employeeService = inject(EmployeeService);
  canViewWitness() {
    return this.employeeService.hasAnyPermissions([
      'VIEW_WITNESS',
      'MANAGE_WITNESS',
    ]);
  }
}
