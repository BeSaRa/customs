import { Component, EventEmitter, inject, input, OnInit } from '@angular/core';
import { AppIcons } from '@constants/app-icons';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { SystemPenalties } from '@enums/system-penalties';
import { PenaltyIcons } from '@constants/penalty-icons';
import { Investigation } from '@models/investigation';
import { Penalty } from '@models/penalty';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { PenaltyDecisionContract } from '@contracts/penalty-decision-contract';
import { EmployeeService } from '@services/employee.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Offender } from '@models/offender';
import { LangService } from '@services/lang.service';
import { of, Subject, tap } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';

@Component({
  selector: 'app-decision-maker',
  standalone: true,
  imports: [
    IconButtonComponent,
    MatIcon,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatTooltip,
  ],
  templateUrl: './decision-maker.component.html',
  styleUrl: './decision-maker.component.scss',
})
export class DecisionMakerComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  protected readonly AppIcons = AppIcons;
  penaltyIcons = PenaltyIcons;

  private employeeService = inject(EmployeeService);
  private penaltyDecisionService = inject(PenaltyDecisionService);
  lang = inject(LangService);
  dialog = inject(DialogService);

  model = input.required<Investigation>();
  updateModel = input.required<EventEmitter<void>>();
  offender = input.required<Offender>();
  penaltyMap =
    input.required<
      Record<number, { first: number | null; second: Penalty[] }>
    >();
  penalties = input.required<Record<number, PenaltyDecisionContract>>();

  systemAction$: Subject<SystemPenalties> = new Subject<SystemPenalties>();

  ngOnInit(): void {
    this.listenToSystemActionChanges();
  }

  getPenaltyIcon(penaltyKey: SystemPenalties) {
    return (
      this.penaltyIcons[penaltyKey] ||
      this.penaltyIcons[SystemPenalties.TERMINATE] // default icon
    );
  }

  canMakeSystemDecision(offenderId: number): boolean {
    return !!(
      (
        this.penalties() &&
        this.penalties()[offenderId] &&
        this.penalties()[offenderId].system.length &&
        (!this.model().hasConcernedOffenders() ||
          (this.model().hasConcernedOffenders() &&
            this.model().isOffenderConcerned(offenderId)))
      ) /*&&
      this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')*/
    );
  }

  canMakeNormalDecision(offenderId: number): boolean {
    return !!(
      (
        this.penalties() &&
        this.penalties()[offenderId] &&
        this.penalties()[offenderId].normal.length
      ) /*&&
      this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')*/
    );
  }

  openDecisionDialog(element: Offender) {
    const oldDecision = this.model().getPenaltyDecisionByOffenderId(
      this.offender().id,
    );
    const systemPenaltyKeys = Object.values(SystemPenalties).filter(Number);
    of(null)
      .pipe(take(1))
      .pipe(
        switchMap(() => {
          return oldDecision &&
            systemPenaltyKeys.includes(oldDecision.penaltyInfo.penaltyKey)
            ? this.dialog
                .confirm(
                  this.lang.map.action_will_effect_current_offender_decision,
                )
                .afterClosed()
                .pipe(
                  map(click => ({
                    click,
                    oldDecision,
                  })),
                )
            : of({
                click: UserClick.YES,
                oldDecision: undefined,
              });
        }),
        filter(({ click }) => {
          return click === UserClick.YES;
        }),
        switchMap(({ oldDecision }) => {
          return oldDecision
            ? oldDecision.delete().pipe(
                tap(() => {
                  this.model().removePenaltyDecision(oldDecision);
                  this.updateModel().emit();
                }),
              )
            : of(null);
        }),
      )
      .subscribe(() => {
        this.penaltyDecisionService.openSingleDecisionDialog(
          element,
          this.model,
          this.updateModel,
          this.penaltyMap()[element.id],
        );
      });
  }

  getSystemPenalties(id: number) {
    return (this.penalties()[id] && this.penalties()[id].system) || [];
  }

  private listenToSystemActionChanges() {
    this.systemAction$
      .pipe(
        map(penaltyKey => {
          return {
            oldPenalty: this.model().getPenaltyDecisionByOffenderId(
              this.offender().id,
            ),
            penaltyKey,
          };
        }),
      )
      .pipe(
        switchMap(({ oldPenalty, penaltyKey }) => {
          return oldPenalty && penaltyKey !== oldPenalty.penaltyInfo.penaltyKey
            ? this.dialog
                .confirm(
                  this.lang.map.action_will_effect_current_offender_decision,
                )
                .afterClosed()
                .pipe(map(click => ({ click, oldPenalty, penaltyKey })))
            : of({
                click: UserClick.YES,
                penaltyKey,
                oldPenalty,
              });
        }),
      )
      .pipe(
        filter(({ click }) => {
          return click === UserClick.YES;
        }),
      )
      .pipe(
        switchMap(({ penaltyKey }) => {
          return penaltyKey === SystemPenalties.TERMINATE
            ? this.openTerminateDialog().afterClosed()
            : this.openRequestReferralDialog(penaltyKey).afterClosed();
        }),
      )
      .subscribe();
  }

  openTerminateDialog() {
    return this.penaltyDecisionService.openTerminateDialog(
      [this.offender()],
      this.model,
      this.updateModel,
      this.penaltyMap()[this.offender().id].second.find(
        item => item.penaltyKey === SystemPenalties.TERMINATE,
      )!,
    );
  }

  openRequestReferralDialog(penaltyKey: SystemPenalties) {
    return this.penaltyDecisionService.openRequestReferralDialog(
      [this.offender()],
      this.model,
      this.updateModel,
      this.penaltyMap()[this.offender().id].second.find(
        item => item.penaltyKey === penaltyKey,
      )!,
    );
  }
}
