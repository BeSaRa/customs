import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  OnInit,
  Output,
} from '@angular/core';
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
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Offender } from '@models/offender';
import { LangService } from '@services/lang.service';
import { of, Subject, tap } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { DialogService } from '@services/dialog.service';
import { UserClick } from '@enums/user-click';
import { OffenderViolationService } from '@services/offender-violation.service';
import { PenaltyService } from '@services/penalty.service';
import { PenaltyDecision } from '@models/penalty-decision';

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

  private penaltyDecisionService = inject(PenaltyDecisionService);
  // don't remove it will break the code because we use it inside the model
  private offenderViolationService = inject(OffenderViolationService);
  private penaltyService = inject(PenaltyService);

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
  @Input() noSystemPenalties: boolean = false;
  systemAction$: Subject<SystemPenalties> = new Subject<SystemPenalties>();
  @Output() decisionMade$: EventEmitter<PenaltyDecision> =
    new EventEmitter<PenaltyDecision>();
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

  openDecisionDialog(offender: Offender) {
    if (
      this.model().shouldCheckProofStatus(
        offender.id,
        this.penalties()[offender.id].managerDecisionControl,
      )
    ) {
      this.dialog.error(
        this.lang.map
          .determine_the_proof_status_for_all_violations_first_to_take_this_action,
      );
      return;
    }

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
      .pipe(
        switchMap(() => {
          return this.penaltyDecisionService
            .openSingleDecisionDialog(
              offender,
              this.model,
              this.updateModel,
              this.penaltyMap()[offender.id],
            )
            .afterClosed();
        }),
      )
      .subscribe(decision => {
        if (decision) {
          this.decisionMade$.emit(decision as PenaltyDecision);
        }
      });
  }

  getSystemPenalties(id: number) {
    return (this.penalties()[id] && this.penalties()[id].system) || [];
  }

  private listenToSystemActionChanges() {
    const referrals = [
      SystemPenalties.REFERRAL_TO_PRESIDENT,
      SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
    ];

    const toggleReferrals = {
      [SystemPenalties.REFERRAL_TO_PRESIDENT]:
        SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
      [SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT]:
        SystemPenalties.REFERRAL_TO_PRESIDENT,
    };

    this.model().itHasReferralRequestBefore(this.offender().id);
    this.model().itIsSameReferralRequestType(referrals[0], this.offender().id);

    this.systemAction$
      .pipe(
        switchMap(penaltyKey => {
          // check if the request has referral ;
          if (referrals.includes(penaltyKey)) {
            const currentPenalty =
              this.penaltyService.systemPenaltiesMap()[penaltyKey];
            const oldPenalty =
              this.penaltyService.systemPenaltiesMap()[
                toggleReferrals[penaltyKey as keyof typeof toggleReferrals]
              ];

            if (
              this.model().itIsSameReferralRequestType(
                penaltyKey,
                this.offender().id,
              )
            ) {
              // if it is same referral type open the dialog and append current offender to same referral request
              const offenders = this.model().getOffendersHasSystemDecision(
                penaltyKey,
                this.offender().id,
              );
              return of({ offenders, penaltyKey });
            } else {
              const offenders = this.model().getOffendersHasSystemDecision(
                toggleReferrals[penaltyKey as keyof typeof toggleReferrals],
                this.offender().id,
              );
              return offenders.length
                ? this.dialog
                    .confirm(
                      this.lang.map.msg_x_referral_request_exist_y.change({
                        x: currentPenalty.getNames(),
                        y: oldPenalty.getNames(),
                      }),
                    )
                    .afterClosed()
                    .pipe(
                      map(click => {
                        return {
                          offenders: click === UserClick.YES ? offenders : [],
                          penaltyKey:
                            click === UserClick.YES
                              ? toggleReferrals[
                                  penaltyKey as keyof typeof toggleReferrals
                                ]
                              : penaltyKey,
                          click,
                        };
                      }),
                      filter(({ click }) => click === UserClick.YES),
                    )
                : of({ offenders: [], penaltyKey });
              // if not same referral request display dialog to the user to till him you have old referral request
            }
          } else {
            return of({ offenders: [], penaltyKey });
          }
        }),
        map(({ penaltyKey, offenders }) => {
          return {
            oldPenalty: this.model().getPenaltyDecisionByOffenderId(
              this.offender().id,
            ),
            penaltyKey,
            offenders,
          };
        }),
      )
      .pipe(
        switchMap(({ oldPenalty, offenders, penaltyKey }) => {
          return oldPenalty && penaltyKey !== oldPenalty.penaltyInfo.penaltyKey
            ? this.dialog
                .confirm(
                  this.lang.map.action_will_effect_current_offender_decision,
                )
                .afterClosed()
                .pipe(map(click => ({ click, oldPenalty, penaltyKey })))
                .pipe(
                  filter(({ click }) => click === UserClick.YES),
                  switchMap(({ oldPenalty, click, penaltyKey }) => {
                    return oldPenalty
                      .delete()
                      .pipe(
                        tap(() => {
                          this.model().removePenaltyDecision(oldPenalty);
                          this.updateModel().emit();
                        }),
                      )
                      .pipe(
                        map(() => {
                          return {
                            oldPenalty,
                            click,
                            penaltyKey,
                            offenders,
                          };
                        }),
                      );
                  }),
                )
            : of({
                click: UserClick.YES,
                penaltyKey,
                oldPenalty,
                offenders,
              });
        }),
      )
      .pipe(
        filter(({ click }) => {
          return click === UserClick.YES;
        }),
      )
      .pipe(
        switchMap(({ penaltyKey, offenders }) => {
          return penaltyKey === SystemPenalties.TERMINATE
            ? this.openTerminateDialog().afterClosed()
            : this.openRequestReferralDialog(
                penaltyKey,
                offenders,
              ).afterClosed();
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

  openRequestReferralDialog(
    penaltyKey: SystemPenalties,
    offenders?: Offender[],
  ) {
    return this.penaltyDecisionService.openRequestReferralDialog(
      [...(offenders ? offenders : []), this.offender()],
      this.model,
      this.updateModel,
      this.penaltyMap()[this.offender().id].second.find(
        item => item.penaltyKey === penaltyKey,
      )!,
    );
  }
}
