import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';

import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';

import { LangService } from '@services/lang.service';
import {
  MatCell,
  MatCellDef,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderCellDef,
  MatHeaderRow,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRow,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-mawared-employee-result-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    MatDialogClose,
    IconButtonComponent,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatHeaderCellDef,
    MatCellDef,
    MatTooltip,
    MatHeaderRow,
    MatRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
  ],
  templateUrl: './mawared-employee-result-popup.component.html',
  styleUrl: './mawared-employee-result-popup.component.scss',
})
export class MawaredEmployeeResultPopupComponent {
  displayedColumns = ['arName', 'enName', 'qid', 'employeeNo', 'actions'];
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dataSource = this.data.mawaredEmployee;
}
