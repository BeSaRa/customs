import { Component, inject, OnInit } from '@angular/core';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { MAT_DIALOG_DATA, MatDialogClose } from '@angular/material/dialog';
import { ButtonComponent } from '@standalone/components/button/button.component';
import { DatePipe } from '@angular/common';
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
import { LangService } from '@services/lang.service';
import { ClearingAgent } from '@models/clearing-agent';

@Component({
  selector: 'app-select-agent-popup',
  standalone: true,
  imports: [
    ButtonComponent,
    DatePipe,
    IconButtonComponent,
    MatCell,
    MatCellDef,
    MatTable,
    MatColumnDef,
    MatHeaderCell,
    MatHeaderCellDef,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatRow,
    MatNoDataRow,
    MatDialogClose,
  ],
  templateUrl: './select-agent-popup.component.html',
  styleUrl: './select-agent-popup.component.scss',
})
export class SelectAgentPopupComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  lang = inject(LangService);
  data = inject(MAT_DIALOG_DATA);
  list: ClearingAgent[] = [];
  displayedColumns: string[] = ['clearingAgentCode', 'name', 'qid', 'actions'];
  ngOnInit() {
    console.log(this.data);
  }
}
