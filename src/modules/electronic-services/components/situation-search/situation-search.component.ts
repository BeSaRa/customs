import { Component, inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Config } from '@constants/config';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { SituationSearch } from '@models/situation-search';
import { LangService } from '@services/lang.service';
import { SituationSearchService } from '@services/situation-search.service';
import { ignoreErrors } from '@utils/utils';
import { catchError, exhaustMap, of, throwError } from 'rxjs';
import { MawaredEmployee } from '@models/mawared-employee';
import { Offender } from '@models/offender';
import { DatePipe } from '@angular/common';
import { ProofTypes } from '@enums/proof-types';
import { OffenderTypes } from '@enums/offender-types';
import { ClearingAgent } from '@models/clearing-agent';
import { ClearingAgency } from '@models/clearing-agency';
import { CaseTypes } from '@enums/case-types';
import { INavigatedItem } from '@contracts/inavigated-item';
import { OpenFrom } from '@enums/open-from';
import { AppFullRoutes } from '@constants/app-full-routes';
import { EncryptionService } from '@services/encryption.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-situation-search',
  templateUrl: './situation-search.component.html',
  styleUrls: ['./situation-search.component.scss'],
  providers: [DatePipe],
})
export class SituationSearchComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  data = inject(MAT_DIALOG_DATA);
  id: number = this.data && (this.data.id as number);
  type: number = this.data && (this.data.type as number);
  isCompany: boolean = this.data && (this.data.isCompany as boolean);
  situations!: SituationSearch[];
  today = new Date();
  offender: Offender = this.data && (this.data.offender as Offender);
  datePipe = inject(DatePipe);
  encrypt = inject(EncryptionService);
  router = inject(Router);
  dialog = inject(MatDialog);
  employee!: MawaredEmployee;
  clearingAgent!: ClearingAgent;
  clearingAgency!: ClearingAgency;

  ngOnInit(): void {
    this.loadSituation();
    if (this.type === OffenderTypes.EMPLOYEE) {
      this.employee = this.offender as unknown as MawaredEmployee;
    } else if (this.type === OffenderTypes.BROKER && !this.isCompany) {
      this.clearingAgent = this.offender as unknown as ClearingAgent;
    } else {
      this.clearingAgency = this.offender as unknown as ClearingAgency;
    }
  }

  lang = inject(LangService);
  situationSearchService = inject(SituationSearchService);
  config = Config;

  private loadSituation() {
    of(null)
      .pipe(
        exhaustMap(() => {
          return this.situationSearchService
            .loadSituation(this.id, this.type, this.isCompany)
            .pipe(
              catchError(error => {
                return throwError(error);
              }),
              ignoreErrors(),
            );
        }),
      )
      .subscribe((data: SituationSearch[]) => {
        this.situations = data;
        // this.displayedList = new MatTableDataSource(data);
      });
  }

  protected readonly MawaredEmployee = MawaredEmployee;

  getDateString(situation: SituationSearch): string {
    if (
      !!situation.violationInfo.violationsDateFrom &&
      !!situation.violationInfo.violationsDateTo
    ) {
      return (
        this.datePipe.transform(
          new Date(situation.violationInfo.violationsDateFrom),
          'dd/MM/yyyy',
        ) +
        ' - ' +
        this.datePipe.transform(
          new Date(situation.violationInfo.violationsDateTo),
          'dd/MM/yyyy',
        )
      );
    }
    return this.datePipe.transform(
      new Date(situation.violationInfo.violationsDate),
      'dd/MM/yyyy',
    )!;
  }

  protected readonly proofTypes = ProofTypes;
  protected readonly CaseTypes = CaseTypes;

  view(caseId: string) {
    this.dialog.closeAll();
    const itemDetails = this.encrypt.encrypt<INavigatedItem>({
      openFrom: OpenFrom.DRAFT_SCREEN,
      taskId: caseId,
      caseId: caseId,
      caseType: CaseTypes.INVESTIGATION,
    });
    this.router
      .navigate([AppFullRoutes.INVESTIGATION], {
        queryParams: { item: itemDetails },
      })
      .then();
  }
}
