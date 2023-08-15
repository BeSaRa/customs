import { Component, Input, OnInit, inject } from '@angular/core';
import { PenaltyDetails } from '@models/penalty-details';
import { PenaltyDetailsService } from '@services/penalty-details.service';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { LangService } from '@services/lang.service';
import { DialogService } from '@services/dialog.service';
import { PenaltyDetailsPopupComponent } from '@modules/administration/popups/penalty-details-popup/penalty-details-popup.component';
import { OperationType } from '@enums/operation-type';
import { Subject } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-penalty-details',
  templateUrl: './penalty-details.component.html',
})
export class PenaltyDetailsComponent implements OnInit {
  ngOnInit(): void {}
  dialog = inject(DialogService);
  @Input() list!: PenaltyDetails[];
  displayedList = new MatTableDataSource(this.list);

  service = inject(PenaltyDetailsService);
  lang = inject(LangService);

  actions: ContextMenuActionContract<PenaltyDetails>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.viewDetails(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: item => {
        this.editDetails(item);
      },
    },
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: item => {
        this.deleteDetails(item);
      },
    },
  ];
  createDetails() {
    this.dialog.open(PenaltyDetailsPopupComponent, {
      data: {
        model: new PenaltyDetails(),
        operation: OperationType.CREATE,
      },
    });
  }
  viewDetails(penaltyDetails: PenaltyDetails) {}

  deleteDetails(_t30: any) {
    throw new Error('Method not implemented.');
  }
  editDetails(_t30: any) {
    throw new Error('Method not implemented.');
  }

  displayedColumns = ['penaltySigner', 'offenderLevel', 'legalRule', 'actions'];
}
