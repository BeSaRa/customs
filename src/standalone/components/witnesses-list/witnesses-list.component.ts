import {
  Component,
  computed,
  inject,
  input,
  Input,
  OnInit,
} from '@angular/core';

import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { LangService } from '@services/lang.service';
import {
  exhaustMap,
  filter,
  map,
  Subject,
  switchMap,
  takeUntil,
  tap,
} from 'rxjs';
import { AppTableDataSource } from '@models/app-table-data-source';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DialogService } from '@services/dialog.service';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { LookupService } from '@services/lookup.service';
import { UserClick } from '@enums/user-click';
import { ToastService } from '@services/toast.service';
import { Lookup } from '@models/lookup';
import { Witness } from '@models/witness';
import { WitnessService } from '@services/witness.service';
import { WitnessCriteriaPopupComponent } from '@standalone/popups/witness-criteria-popup/witness-criteria-popup.component';
import { AssignmentToAttendPopupComponent } from '../assignment-to-attend-popup/assignment-to-attend-popup.component';
import { WitnessTypes } from '@enums/witness-types';
import { EmployeeService } from '@services/employee.service';
import { Investigation } from '@models/investigation';

@Component({
  selector: 'app-witnesses-list',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
  ],
  templateUrl: './witnesses-list.component.html',
  styleUrls: ['./witnesses-list.component.scss'],
})
export class WitnessesListComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  dialog = inject(DialogService);
  toast = inject(ToastService);
  lang = inject(LangService);
  lookupService = inject(LookupService);
  employeeService = inject(EmployeeService);
  model = input.required<Investigation>();
  caseId = computed(() => this.model().id);
  @Input()
  title: string = this.lang.map.external_persons;
  @Input()
  readonly = false;
  add$: Subject<void> = new Subject<void>();
  data = new Subject<Witness[]>();
  dataSource = new AppTableDataSource(this.data);
  reload$: Subject<void> = new Subject<void>();
  edit$ = new Subject<Witness>();
  delete$ = new Subject<Witness>();
  assignmentToAttend$: Subject<Witness> = new Subject<Witness>();
  witnessService = inject(WitnessService);
  displayedColumns = [
    'personType',
    'witnessType',
    'arName',
    'enName',
    'phoneNumber',
    'email',
  ];

  personTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.personType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {},
    );

  witnessTypesMap: Record<number, Lookup> =
    this.lookupService.lookups.witnessType.reduce(
      (acc, item) => ({
        ...acc,
        [item.lookupKey]: item,
      }),
      {},
    );

  ngOnInit(): void {
    this.listenToAdd();
    this.listenToReload();
    this.listenToDelete();
    this.listenToAssignmentToAttend();
    this.reload$.next();
    if (this.canManageWitness()) {
      this.displayedColumns.push('actions');
    }
  }

  private listenToAdd() {
    this.add$
      .pipe(
        tap(
          () =>
            !this.model().violationInfo.length &&
            this.dialog.error(
              this.lang.map.add_violation_first_to_take_this_action,
            ),
        ),
        filter(() => !!this.model().violationInfo.length),
      )
      .pipe(
        exhaustMap(() =>
          this.dialog
            .open(WitnessCriteriaPopupComponent, {
              data: {
                caseId: this.caseId(),
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe(() => this.reload$.next());
  }

  private listenToReload() {
    this.reload$
      .pipe(filter(() => !!this.caseId()))
      .pipe(tap(() => this.witnessService.loadForCase(this.caseId())))
      .pipe(switchMap(() => this.witnessService.loadForCase(this.caseId())))
      .pipe(takeUntil(this.destroy$))
      .subscribe(list => {
        this.data.next(list);
      });
  }

  private listenToDelete() {
    this.delete$
      .pipe(
        switchMap(model =>
          this.dialog
            .confirm(
              this.lang.map.msg_delete_x_confirm.change({
                x: model.getNames(),
              }),
            )
            .afterClosed()
            .pipe(map(userClick => ({ userClick, model }))),
        ),
      )
      .pipe(filter(({ userClick }) => userClick === UserClick.YES))
      .pipe(switchMap(({ model }) => model.delete().pipe(map(() => model))))
      .subscribe(model => {
        this.toast.success(
          this.lang.map.msg_delete_x_success.change({ x: model.getNames() }),
        );
        this.reload$.next();
      });
  }

  resetDataList() {
    this.data.next([]);
  }
  private listenToAssignmentToAttend() {
    this.assignmentToAttend$
      .pipe(
        switchMap((witness: Witness) =>
          this.dialog
            .open(AssignmentToAttendPopupComponent, {
              data: {
                witness: witness,
                caseId: this.caseId,
                type: WitnessTypes.EXTERNAL,
              },
            })
            .afterClosed(),
        ),
      )
      .subscribe();
  }
  canManageWitness() {
    return this.employeeService.hasPermissionTo('MANAGE_WITNESS');
  }
}
