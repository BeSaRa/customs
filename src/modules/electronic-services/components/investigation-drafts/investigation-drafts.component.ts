import { Component, inject, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { AppFullRoutes } from '@constants/app-full-routes';
import { AppIcons } from '@constants/app-icons';
import { ContextMenuActionContract } from '@contracts/context-menu-action-contract';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OffenderTypes } from '@enums/offender-types';
import { OpenFrom } from '@enums/open-from';
import { ColumnsWrapper } from '@models/columns-wrapper';
import { Investigation } from '@models/investigation';
import { NoneFilterColumn } from '@models/none-filter-column';
import { EncryptionService } from '@services/encryption.service';
import { InvestigationDraftsService } from '@services/investigation-drafts.service';
import { LangService } from '@services/lang.service';
import { ignoreErrors } from '@utils/utils';
import { catchError, exhaustMap, of, throwError } from 'rxjs';

@Component({
  selector: 'app-investigation-drafts',
  templateUrl: './investigation-drafts.component.html',
  styleUrls: ['./investigation-drafts.component.scss'],
})
export class InvestigationDraftsComponent implements OnInit {
  router = inject(Router);
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
      callback: (item) => {
        this.view(item);
      },
    },
  ];
  columnsWrapper: ColumnsWrapper<Investigation> = new ColumnsWrapper(
    new NoneFilterColumn('caseIdentifier'),
    new NoneFilterColumn('caseStatus'),
    new NoneFilterColumn('creator'),
    new NoneFilterColumn('department'),
    new NoneFilterColumn('namesOfOffenders'),
    new NoneFilterColumn('actions'),
  );

  private load() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.investigationDraftsService.search().pipe(
            catchError((error) => {
              return throwError(() => error);
            }),
            ignoreErrors(),
          );
        }),
      )
      .subscribe((data: Investigation[]) => {
        data.forEach((investigation) => {
          let employeeCount = 0;
          let clearingAgentCount = 0;
          let namesOfOffenders = '';

          if (investigation.offenderInfo.length > 2) {
            investigation.offenderInfo.forEach((element) => {
              if (element.type === OffenderTypes.ClEARING_AGENT) {
                clearingAgentCount += 1;
              } else if (element.type === OffenderTypes.EMPLOYEE) {
                employeeCount += 1;
              }
            });
            namesOfOffenders =
              this.lang.map.employee_clearing_agent_numbers.change({
                x: employeeCount,
                y: clearingAgentCount,
              });
          } else {
            investigation.offenderInfo.forEach((element, index) => {
              namesOfOffenders += element.offenderInfo?.arName;
              if (index + 1 != investigation.offenderInfo.length) {
                namesOfOffenders += ', ';
              }
            });
          }
          investigation.namesOfOffenders = namesOfOffenders;
        });
        this.displayedList = new MatTableDataSource(data);
      });
  }

  view(item: Investigation) {
    const itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: OpenFrom.SEARCH,
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
}
