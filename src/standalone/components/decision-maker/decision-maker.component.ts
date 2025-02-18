import { Component, EventEmitter, inject, input, OnInit } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatTooltip } from '@angular/material/tooltip';
import { AppIcons } from '@constants/app-icons';
import { PenaltyIcons } from '@constants/penalty-icons';
import { PenaltyDecisionContract } from '@contracts/penalty-decision-contract';
import { SystemPenalties } from '@enums/system-penalties';
import { UserClick } from '@enums/user-click';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { Offender } from '@models/offender';
import { Penalty } from '@models/penalty';
import { DialogService } from '@services/dialog.service';
import { LangService } from '@services/lang.service';
import { OffenderViolationService } from '@services/offender-violation.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { PenaltyService } from '@services/penalty.service';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { of, Subject, tap } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { OffenderStatusEnum } from '@enums/offender-status.enum';

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
  isPenaltyModification = input.required<boolean>();
  updateModel = input.required<EventEmitter<void>>();
  offender = input.required<Offender>();
  penaltyMap =
    input.required<
      Record<number, { first: number | null; second: Penalty[] }>
    >();

  isSomeOffenderViolationsProofed = input.required<boolean>();
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

  private getValidPenalties(offenderId: number, type: 'system' | 'normal') {
    return this.penalties()?.[offenderId]?.[type] ?? [];
  }
  canMakeSystemDecision(offenderId: number): boolean {
    const penalties = this.getValidPenalties(offenderId, 'system');
    const hasConcernedOffenders = this.model().hasConcernedOffenders();
    return (
      penalties.length > 0 &&
      (!hasConcernedOffenders || this.model().isOffenderConcerned(offenderId))
    );
  }

  canMakeNormalDecision(offenderId: number): boolean {
    const penalties = this.getValidPenalties(offenderId, 'normal');
    const hasConcernedOffenders = this.model().hasConcernedOffenders();
    return (
      penalties.length > 0 &&
      (!hasConcernedOffenders || this.model().isOffenderConcerned(offenderId))
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
            systemPenaltyKeys.includes(oldDecision.penaltyInfo.penaltyKey) &&
            this.model().inSubmitInvestigationActivity()
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
          offender,
          this.model,
          this.updateModel,
          this.penaltyMap()[offender.id],
          this.isPenaltyModification(),
        );
      });
  }

  private listenToSystemActionChanges() {
    const referrals = [
      SystemPenalties.REFERRAL_TO_PRESIDENT,
      SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
      SystemPenalties.REFERRAL_TO_LEGAL_AFFAIRS,
      SystemPenalties.REFERRAL_DISCIPLINARY_COMMITTEE,
      SystemPenalties.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL,
    ];

    const toggleReferrals = {
      [SystemPenalties.REFERRAL_TO_PRESIDENT]:
        SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT,
      [SystemPenalties.REFERRAL_TO_PRESIDENT_ASSISTANT]:
        SystemPenalties.REFERRAL_TO_PRESIDENT,
      [SystemPenalties.REFERRAL_DISCIPLINARY_COMMITTEE]:
        SystemPenalties.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL,
      [SystemPenalties.REFERRAL_TO_PERMANENT_DISCIPLINARY_COUNCIL]:
        SystemPenalties.REFERRAL_DISCIPLINARY_COMMITTEE,
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
          return oldPenalty &&
            penaltyKey !== oldPenalty.penaltyInfo.penaltyKey &&
            this.model().inSubmitInvestigationActivity()
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
      this.isPenaltyModification(),
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

  shouldDisableNormalDecision(): boolean {
    const offenderId = this.offender().id;
    return (
      !this.canMakeNormalDecision(offenderId) ||
      !this.isSomeOffenderViolationsProofed ||
      this.notUnderModificationOnModificationCase()
    );
  }

  shouldDisableSystemDecision(): boolean {
    const offenderId = this.offender().id;
    return (
      !this.canMakeSystemDecision(offenderId) ||
      this.getSystemPenalties(offenderId).length === 0 ||
      this.notUnderModificationOnModificationCase()
    );
  }

  notUnderModificationOnModificationCase(): boolean {
    return (
      this.model().isModificationPenaltyCase() &&
      this.offender().status !== OffenderStatusEnum.UNDER_MODIFICATION
    );
  }

  getSystemPenalties(id: number) {
    if (this.notUnderModificationOnModificationCase()) return [];

    const penalties = this.penalties()?.[id]?.system ?? [];

    return this.isPenaltyModification()
      ? penalties.filter(
          penalty => penalty.penaltyKey === SystemPenalties.TERMINATE,
        )
      : penalties;
  }
}
