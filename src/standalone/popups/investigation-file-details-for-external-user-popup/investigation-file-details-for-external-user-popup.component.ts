import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { InputComponent } from '@standalone/components/input/input.component';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaComponent } from '@standalone/components/textarea/textarea.component';
import { LangService } from '@services/lang.service';
import { Config } from '@constants/config';
import { DatePipe } from '@angular/common';
import { OffenderViolationsComponent } from '@standalone/components/offender-violations/offender-violations.component';
import { EmployeeService } from '@services/employee.service';
import { OffenderViolation } from '@models/offender-violation';

@Component({
  selector: 'app-investigation-file-details-for-external-user-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    MatDialogClose,
    MatIcon,
    ReactiveFormsModule,
    TextareaComponent,
    DatePipe,
    OffenderViolationsComponent,
  ],
  templateUrl:
    './investigation-file-details-for-external-user-popup.component.html',
  styleUrl:
    './investigation-file-details-for-external-user-popup.component.scss',
})
export class InvestigationFileDetailsForExternalUserPopupComponent {
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  loggedInUserId = inject(EmployeeService).loggedInUserId;
  model = this.data.model;
  protected readonly Config = Config;
  get offenderViolationInfo() {
    return this.model.offenderViolationInfo.filter(
      (offenderViolation: OffenderViolation) =>
        offenderViolation.offenderRefId === this.loggedInUserId,
    );
  }
}
