import { Component, OnInit, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Penalty } from '@models/penalty';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';

@Component({
  selector: 'app-penalty',
  templateUrl: './penalty.component.html',
  styleUrls: ['./penalty.component.scss'],
})
export class PenaltyComponent extends AdminComponent<
  PenaltyPopupComponent,
  Penalty,
  PenaltyService
> {
  filter_Value!: string;
  service = inject(PenaltyService);
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'status',
    'actions',
  ];

  filterValue(event: any) {
    //console.log(typeof (event));
    console.log('event: ', event);
    console.log('event.target.value');
    this.filter_Value = event.target.value;
    this.filter$.next({ enName: this.filter_Value });
  }

  actions: ContextMenuActionContract<Penalty>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: (item) => {
        this.view$.next(item);
      },
    },
    {
      name: 'edit',
      type: 'action',
      label: 'edit',
      icon: AppIcons.EDIT,
      callback: (item) => {
        this.edit$.next(item);
      },
    },
    {
      name: 'delete',
      type: 'action',
      label: 'delete',
      icon: AppIcons.DELETE,
      callback: (item) => {
        this.delete$.next(item);
      },
    },
  ];
}
