import { Component, inject, OnInit } from '@angular/core';
import { AdminComponent } from '@abstracts/admin-component';
import { UserGuide } from '@models/user-guide';
import { UserGuideService } from '@services/user-guide.service';
import { UserGuidePopupComponent } from '@modules/administration/popups/user-guide-popup/user-guide-popup.component';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { AppIcons } from '@constants/app-icons';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { NoneFilterColumn } from '@models/none-filter-column';
import { Subject } from 'rxjs';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatTooltip } from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
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
import { ContextMenuComponent } from '@standalone/components/context-menu/context-menu.component';

@Component({
  selector: 'app-user-guide',
  templateUrl: './user-guide.component.html',
  styleUrls: ['./user-guide.component.scss'],
  standalone: true,
  imports: [
    IconButtonComponent,
    MatTooltip,
    AsyncPipe,
    MatProgressSpinner,
    MatTable,
    MatRow,
    MatHeaderRow,
    MatHeaderRowDef,
    MatRowDef,
    MatNoDataRow,
    ContextMenuComponent,
    MatCell,
    MatCellDef,
    MatHeaderCellDef,
    MatHeaderCell,
    MatColumnDef,
  ],
})
export class UserGuideComponent
  extends AdminComponent<UserGuidePopupComponent, UserGuide, UserGuideService>
  implements OnInit
{
  service = inject(UserGuideService);
  open$: Subject<UserGuide> = new Subject<UserGuide>();

  override ngOnInit() {
    super.ngOnInit();
    this.listenToDownload();
  }

  actions: ContextMenuActionContract<UserGuide>[] = [
    {
      name: 'open',
      type: 'action',
      label: 'actions',
      icon: AppIcons.OPEN_IN_NEW,
      callback: item => {
        this.open$.next(item);
      },
    },
  ];
  // here we have a new implementation for displayed/filter Columns for the table
  columnsWrapper: ColumnsWrapper<UserGuide> = new ColumnsWrapper(
    new NoneFilterColumn('arName'),
    new NoneFilterColumn('enName'),
    new NoneFilterColumn('actions'),
  );
  listenToDownload() {
    this.open$.subscribe(userGuide => {
      if (userGuide && userGuide.guideURL) {
        window.open(userGuide.guideURL, '_blank');
      }
    });
  }
}
