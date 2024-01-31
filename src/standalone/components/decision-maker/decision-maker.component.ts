import {
  Component,
  computed,
  EventEmitter,
  inject,
  input,
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
import { EmployeeService } from '@services/employee.service';
import { PenaltyDecisionService } from '@services/penalty-decision.service';
import { Offender } from '@models/offender';
import { LangService } from '@services/lang.service';

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
export class DecisionMakerComponent extends OnDestroyMixin(class {}) {
  protected readonly AppIcons = AppIcons;
  penaltyIcons = PenaltyIcons;

  private employeeService = inject(EmployeeService);
  private penaltyDecisionService = inject(PenaltyDecisionService);
  lang = inject(LangService);

  model = input.required<Investigation>();
  updateModel = input.required<EventEmitter<void>>();
  offender = input.required<Offender>();
  penaltyMap =
    input.required<
      Record<number, { first: number | null; second: Penalty[] }>
    >();

  penalties = computed(() => {
    return Object.keys(this.penaltyMap()).reduce<
      Record<string, PenaltyDecisionContract>
    >((acc, offenderId) => {
      if (!acc[offenderId]) {
        acc[offenderId] = {
          managerDecisionControl: this.penaltyMap()[Number(offenderId)].first,
          system: this.penaltyMap()[Number(offenderId)].second.filter(
            p => p.isSystem,
          ),
          normal: this.penaltyMap()[Number(offenderId)].second.filter(
            p => !p.isSystem,
          ),
        };
      }
      return { ...acc };
    }, {});
  });

  getPenaltyIcon(penaltyKey: SystemPenalties) {
    return (
      this.penaltyIcons[penaltyKey] ||
      this.penaltyIcons[SystemPenalties.TERMINATE] // default icon
    );
  }

  canMakeSystemDecision(offenderId: number): boolean {
    return !!(
      this.penalties() &&
      this.penalties()[offenderId] &&
      this.penalties()[offenderId].system.length &&
      this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')
    );
  }

  canMakeNormalDecision(offenderId: number): boolean {
    return !!(
      this.penalties() &&
      this.penalties()[offenderId] &&
      this.penalties()[offenderId].normal.length &&
      this.employeeService.hasPermissionTo('MANAGE_OFFENDER_VIOLATION')
    );
  }

  openDecisionDialog(element: Offender) {
    this.penaltyDecisionService.openSingleDecisionDialog(
      element,
      this.model,
      this.updateModel,
      this.penaltyMap()[element.id],
    );
  }

  getSystemPenalties(id: number) {
    return (this.penalties()[id] && this.penalties()[id].system) || [];
  }
}
