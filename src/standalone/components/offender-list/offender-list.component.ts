import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { exhaustMap, Subject } from 'rxjs';
import { Violation } from '@models/violation';
import { AppTableDataSource } from '@models/app-table-data-source';
import { OffenderService } from '@services/offender.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { OffenderCriteriaPopupComponent } from '@standalone/popups/offender-criteria-popup/offender-criteria-popup.component';

@Component({
  selector: 'app-offender-list',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSortModule, MatTableModule, MatTooltipModule],
  templateUrl: './offender-list.component.html',
  styleUrls: ['./offender-list.component.scss'],
})
export class OffenderListComponent implements OnInit {
  dialog = inject(DialogService);
  lang = inject(LangService);
  @Input()
  caseId!: string;
  @Input()
  title: string = this.lang.map.offenders;
  add$: Subject<void> = new Subject<void>();
  data = new Subject<Violation[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Violation>();
  delete$ = new Subject<Violation>();
  offenderService = inject(OffenderService);
  displayedColumns = ['violationType', 'description', 'actions'];

  ngOnInit(): void {
    this.add$.next();
    this.listenToAdd();
  }

  private listenToAdd() {
    this.add$.pipe(exhaustMap(() => this.dialog.open(OffenderCriteriaPopupComponent).afterClosed())).subscribe();
  }
}
