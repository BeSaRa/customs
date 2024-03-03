import { Component, inject, Input } from '@angular/core';
import { AppIconsType } from '@constants/app-icons';
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

  @Input({ required: true })
  isCompany!: boolean;
  @Input({ required: true })
  id!: number;
  @Input({ required: true })
  type!: number;
  @Input({ required: true })
  icon: keyof AppIconsType = 'RELOAD';

  onSearchSituationBtnClick() {
    of(null)
      .pipe(
        switchMap(() => {
          return this.dialog
            .open(SituationSearchComponent, {
              data: {
                id: this.id,
                type: this.type,
                isCompany: this.isCompany,
              },
            })
            .afterClosed();
        }),
      )
      .subscribe();
  }
}
