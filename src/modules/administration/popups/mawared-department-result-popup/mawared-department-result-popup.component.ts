import { Component, inject } from '@angular/core';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
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
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { LangService } from '@services/lang.service';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-mawared-department-result-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatColumnDef,
    MatDialogClose,
    MatHeaderCell,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRow,
    MatRowDef,
    MatTable,
    MatHeaderCellDef,
    MatNoDataRow,
    MatTooltip,
  ],
  templateUrl: './mawared-department-result-popup.component.html',
  styleUrl: './mawared-department-result-popup.component.scss',
})
export class MawaredDepartmentResultPopupComponent {
  displayedColumns = ['arName', 'enName', 'actions'];
  data = inject(MAT_DIALOG_DATA);
  lang = inject(LangService);
  dataSource = this.data.mawaredDepartments;
}
