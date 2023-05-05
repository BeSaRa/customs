import { Component, OnInit, inject } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { Penalty } from '@models/penalty';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyPopupComponent } from '@modules/administration/popups/penalty-popup/penalty-popup.component';

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
  service = inject(PenaltyService);
  displayedColumns: string[] = [
    'select',
    'arName',
    'enName',
    'status',
    'actions',
  ];
}
