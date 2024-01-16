import { Component, OnInit, inject } from '@angular/core';

import { IconButtonComponent } from '../icon-button/icon-button.component';
import { ButtonComponent } from '../button/button.component';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LangService } from '@services/lang.service';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssignmentToAttend } from '@models/assignment-to-attend';
import { InputComponent } from '../input/input.component';
import { LookupService } from '@services/lookup.service';
import { SelectInputComponent } from '../select-input/select-input.component';
import { MawaredEmployeeService } from '@services/mawared-employee.service';
import { MawaredEmployee } from '@models/mawared-employee';
import { TextareaComponent } from '../textarea/textarea.component';
import { UserTypes } from '@enums/user-types';
import { Subject, catchError, exhaustMap, tap, throwError } from 'rxjs';
import { AssignmentToAttendService } from '@services/assignment-to-attend.service';
import { ignoreErrors } from '@utils/utils';

@Component({
  selector: 'app-assignment-to-attend',
  standalone: true,
  imports: [
    IconButtonComponent,
    ButtonComponent,
    MatDialogModule,
    InputComponent,
    TextareaComponent,
    ReactiveFormsModule,
    FormsModule,
    SelectInputComponent,
  ],
  templateUrl: './assignment-to-attend-popup.component.html',
  styleUrls: ['./assignment-to-attend-popup.component.scss'],
})
export class AssignmentToAttendPopupComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  form!: FormGroup;
  fb = inject(FormBuilder);
  userTypes = inject(LookupService).lookups.userType;
  personTypes = inject(LookupService).lookups.personType;
  offenderTypes = inject(LookupService).lookups.offenderType;
  mawaredEmployeeService = inject(MawaredEmployeeService);
  mawaredEmployee!: MawaredEmployee[];
  assignmentToAttend$: Subject<void> = new Subject<void>();
  assignmentToAttendService = inject(AssignmentToAttendService);

  ngOnInit(): void {
    this.form = this.fb.group(new AssignmentToAttend().buildForm());
    this.mawaredEmployeeService.loadAsLookups().subscribe(emp => (this.mawaredEmployee = emp));
    this.caseId?.setValue(this.data.caseId);
    if (this.isInternal()) {
      this.summonedId?.setValue(this.data?.offender?.id);
      this.summonedType?.setValue(this.data.offender.type);
      this.arName?.setValue(this.data.offender.arName);
      this.enName?.setValue(this.data.offender.enName);
    } else {
      this.summonedType?.setValue(this.data.witness.personType);
      this.summonedId?.setValue(this.data?.witness?.id);
      this.arName?.setValue(this.data.witness.arName);
      this.enName?.setValue(this.data.witness.enName);
    }
    this.type?.setValue(this.data.type);
    this.assignmentToAttend();
  }

  get caseId() {
    return this.form.get('caseId');
  }
  get note() {
    return this.form.get('note');
  }
  get summonedType() {
    return this.form.get('summonedType');
  }
  get summonedId() {
    return this.form.get('summonedId');
  }
  get type() {
    return this.form.get('type');
  }
  get arName() {
    return this.form.get('arName');
  }
  get enName() {
    return this.form.get('enName');
  }
  isInternal() {
    return this.data.type === UserTypes.INTERNAL;
  }

  private assignmentToAttend() {
    this.assignmentToAttend$
      .pipe(tap(() => console.log(this.form.value)))
      .pipe(
        exhaustMap(() => {
          return this.assignmentToAttendService.assignToAttend(this.form.value).pipe(
            catchError(error => {
              return throwError(error);
            }),
            ignoreErrors()
          );
        })
      )
      .subscribe(() => {
        console.log('done');
      });
  }
}
