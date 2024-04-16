import { Component, computed, inject, input, OnInit } from '@angular/core';
import { OnDestroyMixin } from '@mixins/on-destroy-mixin';
import { Investigation } from '@models/investigation';
import { ActivitiesName } from '@enums/activities-name';
import { MeetingService } from '@services/meeting.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Meeting } from '@models/meeting';
import { PenaltyDecision } from '@models/penalty-decision';
import { IconButtonComponent } from '@standalone/components/icon-button/icon-button.component';
import { LangService } from '@services/lang.service';
import { OffenderViolationsComponent } from '@standalone/components/offender-violations/offender-violations.component';
import { switchMap } from 'rxjs';
import { OffenderViolationService } from '@services/offender-violation.service';
import { OffenderViolation } from '@models/offender-violation';
import { Config } from '@constants/config';
import { DatePipe } from '@angular/common';
import { OffenderListComponent } from '@standalone/components/offender-list/offender-list.component';
import { MeetingAttendanceListComponent } from '@standalone/components/meeting-attendance-list/meeting-attendance-list.component';

@Component({
  selector: 'app-review-minutes',
  standalone: true,
  imports: [
    IconButtonComponent,
    OffenderViolationsComponent,
    DatePipe,
    OffenderListComponent,
    MeetingAttendanceListComponent,
  ],
  templateUrl: './review-minutes.component.html',
  styleUrl: './review-minutes.component.scss',
})
export class ReviewMinutesComponent
  extends OnDestroyMixin(class {})
  implements OnInit
{
  meetingService = inject(MeetingService);
  penaltyDecisionService = inject(PenaltyDecisionService);
  lang = inject(LangService);
  offenderViolationService = inject(OffenderViolationService);
  model = input.required<Investigation>();
  meetingMinutesModel!: Meeting;
  decisionMinutesModel!: PenaltyDecision;
  offenderViolations: OffenderViolation[] = [];
  ConcernedId = computed(() => {
    return this.model()?.taskDetails.activityProperties?.ConcernedId.value;
  });
  protected readonly ActivitiesName = ActivitiesName;
  ngOnInit() {
    if (this.model().isDecision()) {
      this.ConcernedId() &&
        this.penaltyDecisionService
          .loadByIdComposite(this.ConcernedId() as number)
          .pipe(
            switchMap(rs => {
              this.decisionMinutesModel = rs;
              return this.offenderViolationService.load(undefined, {
                offenderId: rs.offenderId,
              });
            }),
          )
          .subscribe(({ rs }) => {
            this.offenderViolations = rs;
          });
    } else {
      this.ConcernedId() &&
        this.meetingService
          .loadByIdComposite(this.ConcernedId() as number)
          .subscribe(rs => {
            this.meetingMinutesModel = rs;
          });
    }
  }

  protected readonly Config = Config;
}
