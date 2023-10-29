import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import { exhaustMap, filter, map, of, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AppTableDataSource } from '@models/app-table-data-source';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LookupService } from '@services/lookup.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { Violation } from '@models/violation';
import { Lookup } from '@models/lookup';
import { Witness } from '@models/witness';
import { WitnessService } from '@services/witness.service';
import { WitnessCriteriaPopupComponent } from '@standalone/popups/witness-criteria-popup/witness-criteria-popup.component';

@Component({
  selector: 'app-witnesses-list',
  standalone: true,
  imports: [CommonModule, IconButtonComponent, MatSortModule, MatTableModule, MatTooltipModule],
  templateUrl: './witnesses-list.component.html',
  styleUrls: ['./witnesses-list.component.scss'],
})
export class WitnessesListComponent extends OnDestroyMixin(class { }) implements OnInit {
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  @Input()
  violations!: Violation[];
  @Input()
  caseId?: string;
  @Input()
  title: string = this.lang.map.external_persons;
  add$: Subject<void> = new Subject<void>();
  data = new Subject<Witness[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Witness>();
  delete$ = new Subject<Witness>();
  witnessService = inject(WitnessService);
  displayedColumns = ['personType', 'witnessType', 'arName', 'enName', 'actions'];

  personTypesMap: Record<number, Lookup> = this.lookupService.lookups.personType.reduce(
    (acc, item) => ({
      ...acc,
      [item.lookupKey]: item,
    }),
    {}
  );

  witnessTypesMap: Record<number, Lookup> = this.lookupService.lookups.witnessType.reduce(
    (acc, item) => ({
      ...acc,
      [item.lookupKey]: item,
    }),
    {}
  );

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToDelete();
    this.reload$.next();
  }

  private listenToAdd() {
    this.add$
      .pipe(
        tap(() => !this.violations.length && this.dialog.error(this.lang.map.add_violation_first_to_take_this_action)),
        filter(() => !!this.violations.length)
      )
      .pipe(
        exhaustMap(() =>
          this.dialog
            .open(WitnessCriteriaPopupComponent, {
              data: {
                caseId: this.caseId,
              },
            })
            .afterClosed()
        )
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(filter(() => !!this.caseId))
      .pipe(switchMap(() => this.witnessService.load(undefined, { caseId: this.caseId })))
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data.next(list.rs);
      });
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        switchMap(model =>
          this.dialog
            .confirm(this.lang.map.msg_delete_x_confirm.change({ x: model.getNames() }))
            .afterClosed()
            .pipe(map(userClick => ({ userClick, model })))
        )
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(switchMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        this.toast.success(this.lang.map.msg_delete_x_success.change({ x: model.getNames() }));
        this.reload$.next();
      });
  }
  deleteAllWitnesses() {
    return this.witnessService.deleteBulk(this.dataSource.data.map((witness: Witness) => witness.id)).subscribe(() => {
      this.reload$.next();
    });
  }
  resetDataList() {
    this.data.next([]);
  }
}
