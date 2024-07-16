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
import { Memorandum } from '@models/memorandum';

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
  isOpenedFromSearch = input.required<boolean>();
  memorandumMasterComponent =
    viewChild<MemorandumOpinionListComponent>('master');

  canViewWitness() {
    return this.employeeService.hasAnyPermissions([
      'VIEW_WITNESS',
      'MANAGE_WITNESS',
    ]);
  }

  getLastApprovedLegalMemo() {
    const memos = this.memorandumMasterComponent()
      ?.models as unknown as Memorandum[];
    return this.getLastModifiedApprovedMemo(memos);
  }

  getLastModifiedApprovedMemo(memos: Memorandum[]) {
    let lastModifiedApprovedMemo: Memorandum = memos[0];

    memos.forEach(memo => {
      if (memo.isApproved) {
        if (
          !lastModifiedApprovedMemo ||
          new Date(memo.lastModified) >
            new Date(lastModifiedApprovedMemo.lastModified)
        ) {
          lastModifiedApprovedMemo = memo;
        }
      }
    });
    return lastModifiedApprovedMemo;
  }
}
