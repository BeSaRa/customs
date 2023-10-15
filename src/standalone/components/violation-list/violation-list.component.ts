import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LangService } from '@services/lang.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { map, Subject, switchMap, takeUntil } from 'rxjs';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { InvestigationService } from '@services/investigation.service';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { AppTableDataSource } from '@models/app-table-data-source';
import { ViolationService } from '@services/violation.service';
import { Violation } from '@models/violation';
import { Config } from '@constants/config';

@Component({
  selector: 'app-violation-list',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatTableModule, MatSortModule],
  templateUrl: './violation-list.component.html',
  styleUrls: ['./violation-list.component.scss'],
})
export class ViolationListComponent extends OnDestroyMixin(class {}) implements OnInit {
  lang = inject(LangService);
  @Input()
  title: string = this.lang.map.violations;
  add$: Subject<void> = new Subject<void>();
  service = inject(InvestigationService);
  @Input()
  caseId!: string;
  data = new Subject<Violation[]>();
  dataSource = new AppTableDataSource(this.data);
  displayedColumns = ['violationType', 'description', 'creationDate', 'actions'];
  reload$: Subject<void> = new Subject<void>();

  violationService = inject(ViolationService);

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.add$.next(); // for testing purpose
  }

  private listenToAdd() {
    this.add$
      .pipe(takeUntil(this.destroy$))
      .pipe(map(() => this.service.openAddViolation(this.caseId)))
      .subscribe();
  }

  private listenToReload() {
    this.reload$
      .pipe(takeUntil(this.destroy$))
      .pipe(
        switchMap(() =>
          this.violationService.load(undefined, { caseId: this.caseId }).pipe(
            map(pagination => {
              this.data.next(pagination.rs);
              return pagination;
            })
          )
        )
      )
      .subscribe();
  }

  protected readonly Config = Config;
}
