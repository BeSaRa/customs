import { Component, inject, OnInit } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
} from '@angular/forms';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { CrudDialogDataContract } from '@contracts/crud-dialog-data-contract';
import { RequestStatement } from '@models/request-statement';
import { EmployeeService } from '@services/employee.service';
import { Investigation } from '@models/investigation';
import { SelectInputComponent } from '@standalone/components/select-input/select-input.component';
import { OrganizationUnit } from '@models/organization-unit';
import { OrganizationUnitService } from '@services/organization-unit.service';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { StatementService } from '@services/statement.service';
import { exhaustMap, filter, of, switchMap } from 'rxjs';
import { ToastService } from '@services/toast.service';
import { DialogRef } from '@angular/cdk/dialog';

@Component({
  selector: 'app-request-statement-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    ReactiveFormsModule,
    SelectInputComponent,
    TextareaComponent,
  ],
  templateUrl: './request-statement-popup.component.html',
  styleUrl: './request-statement-popup.component.scss',
})
export class RequestStatementPopupComponent implements OnInit {
  lang = inject(LangService);
  employeeService = inject(EmployeeService);
  form!: UntypedFormGroup;
  data: CrudDialogDataContract<Investigation> = inject(MAT_DIALOG_DATA);
  model!: RequestStatement;
  fb = inject(UntypedFormBuilder);
  caseModel: Investigation = this.data && (this.data.model as Investigation);
  organizationUnits!: OrganizationUnit[];
  organizationUnitService = inject(OrganizationUnitService);
  statementService = inject(StatementService);
  toast = inject(ToastService);
  dialogRef = inject(DialogRef);
  ngOnInit() {
    this.model = new RequestStatement();
    this.form = this.fb.group(this.model.buildForm());
    this.approveCtrl?.setValue(this.hasStatementApprovePermission());
    this.caseIdCtrl?.setValue(this.caseModel.id);
    this.loadOrganizationUnits();
  }

  get caseIdCtrl() {
    return this.form.get('caseId');
  }
  get approveCtrl() {
    return this.form.get('approve');
  }

  hasStatementApprovePermission() {
    return this.employeeService.hasPermissionTo('STATEMENT_APPROVAL');
  }
  loadOrganizationUnits() {
    this.organizationUnitService
      .loadAsLookups()
      .subscribe(ous => (this.organizationUnits = ous));
  }

  protected _beforeSave(): boolean {
    this.form.markAllAsTouched();
    return this.form.valid;
  }

  protected _afterSave(): void {
    this.toast.success(this.lang.map.msg_save_x_success);
    this.dialogRef.close();
  }
  requestStatement() {
    of(null)
      .pipe(
        switchMap(() => {
          return of(this._beforeSave());
        }),
      )
      .pipe(filter(value => value))
      .pipe(
        exhaustMap(() => {
          return this.statementService.requestStatement(this.form.value);
        }),
      )
      .subscribe(() => {
        this._afterSave();
      });
  }
}
