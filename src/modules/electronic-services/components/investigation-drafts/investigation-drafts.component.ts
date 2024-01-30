import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OpenFrom } from '@enums/open-from';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Investigation } from '@models/investigation';
import { NoneFilterColumn } from '@models/none-filter-column';
import { EncryptionService } from '@services/encryption.service';
import { InvestigationDraftsService } from '@services/investigation-drafts.service';
import { LangService } from '@services/lang.service';
import { ignoreErrors } from '@utils/utils';
import { catchError, exhaustMap, of, throwError } from 'rxjs';
import { ActionsOnCaseComponent } from '@modules/electronic-services/components/actions-on-case/actions-on-case.component';
import { DialogService } from '@services/dialog.service';

@Component({
  selector: 'app-investigation-drafts',
  templateUrl: './investigation-drafts.component.html',
  styleUrls: ['./investigation-drafts.component.scss'],
})
export class InvestigationDraftsComponent implements OnInit {
  router = inject(Router);
  dialog = inject(DialogService);
  encrypt = inject(EncryptionService);

  lang = inject(LangService);
  investigationDraftsService = inject(InvestigationDraftsService);
  displayedList = new MatTableDataSource<Investigation>();

  ngOnInit(): void {
    this.load();
  }

  actions: ContextMenuActionContract<Investigation>[] = [
    {
      name: 'view',
      type: 'action',
      label: 'view',
      icon: AppIcons.VIEW,
      callback: item => {
        this.view(item);
      },
    },
  ];
  columnsWrapper: ColumnsWrapper<Investigation> = new ColumnsWrapper(
    new NoneFilterColumn('draftFullSerial'),
    new NoneFilterColumn('caseStatus'),
    new NoneFilterColumn('creator'),
    new NoneFilterColumn('department'),
    new NoneFilterColumn('actions'),
  );

  private load() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.investigationDraftsService.search().pipe(
            catchError(error => {
              return throwError(() => error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe((data: Investigation[]) => {
        this.displayedList = new MatTableDataSource(data);
      });
  }

  view(item: Investigation) {
    const itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: OpenFrom.DRAFT_SCREEN,
      taskId: item.id,
      caseId: item.id,
      caseType: item.caseType,
    });
    this.router
      .navigate([AppFullRoutes.INVESTIGATION], {
        queryParams: { item: itemDetails },
      })
      .then();
  }
  showActionsOnCase(item: Investigation) {
    this.dialog.open(ActionsOnCaseComponent, {
      data: { caseId: item.id },
    });
  }
}
