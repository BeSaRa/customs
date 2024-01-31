import { Penalty } from '@models/penalty';

export interface PenaltyDecisionContract {
  managerDecisionControl: number | null;
  system: Penalty[];
  normal: Penalty[];
}
