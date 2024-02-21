import { Component, inject, Input } from '@angular/core';
import { AppIconsType } from '@constants/app-icons';
import { OffenderTypes } from '@enums/offender-types';
import { ClearingAgent } from '@models/clearing-agent';
import { Offender } from '@models/offender';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { of, switchMap } from 'rxjs';
import { SituationSearchComponent } from '../situation-search/situation-search.component';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-situation-search-btn',
  standalone: true,
  templateUrl: './situation-search-btn.component.html',
  styleUrls: ['./situation-search-btn.component.scss'],
  imports: [
    IconButtonComponent,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatTooltipModule,
  ],
})
export class SituationSearchBtnComponent {
  lang = inject(LangService);
  dialog = inject(DialogService);
  @Input()
  isCompany!: boolean;
  @Input()
  offender!: Offender;
  @Input()
  icon: keyof AppIconsType = 'RELOAD';

  onSearchSituationBtnClick() {
    of(null)
      .pipe(
        switchMap(() => {
          let id;
          if (this.isCompany) {
            id = !this.offender.offenderInfo
              ? (this.offender as unknown as ClearingAgent).agencyId
              : (this.offender.offenderInfo as unknown as ClearingAgent)
                  .agencyId;
          } else {
            if (this.offender.type === OffenderTypes.BROKER) {
              id = !this.offender.offenderInfo
                ? (this.offender as unknown as ClearingAgent).agentId
                : (this.offender.offenderInfo as unknown as ClearingAgent)
                    .agentId;
            } else if (this.offender.type === OffenderTypes.EMPLOYEE) {
              id = !this.offender.offenderInfo
                ? this.offender.id
                : this.offender.offenderInfo?.id;
            }
          }
          return this.dialog
            .open(SituationSearchComponent, {
              data: {
                id,
                type: this.offender.type,
                isCompany: this.isCompany,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
}
