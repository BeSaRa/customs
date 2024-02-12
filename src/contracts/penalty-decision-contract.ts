import { Penalty } from '@models/penalty';
import { ManagerDecisions } from '@enums/manager-decisions';

export interface PenaltyDecisionContract {
  managerDecisionControl: ManagerDecisions | null;
  system: Penalty[];
  normal: Penalty[];
}
