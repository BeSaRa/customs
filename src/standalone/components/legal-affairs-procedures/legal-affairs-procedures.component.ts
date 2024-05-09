import {
  Component,
  EventEmitter,
  inject,
  input,
  Output,
  viewChild,
} from '@angular/core';
import { PersonsListComponent } from '@standalone/components/legal-affairs-offenders/persons-list.component';
import { Investigation } from '@models/investigation';
import { MemorandumOpinionListComponent } from '@standalone/components/memorandum-opinion-list/memorandum-opinion-list.component';
import { EmployeeService } from '@services/employee.service';

@Component({
  selector: 'app-legal-affairs-procedures',
  standalone: true,
  imports: [PersonsListComponent, MemorandumOpinionListComponent],
  templateUrl: './legal-affairs-procedures.component.html',
  styleUrl: './legal-affairs-procedures.component.scss',
})
export class LegalAffairsProceduresComponent {
  model = input.required<Investigation>();
  employeeService = inject(EmployeeService);
  @Output()
  updateModel = new EventEmitter<void>();
  memorandumMasterComponent =
    viewChild<MemorandumOpinionListComponent>('master');

  canViewWitness() {
    return this.employeeService.hasAnyPermissions([
      'VIEW_WITNESS',
      'MANAGE_WITNESS',
    ]);
  }
}
