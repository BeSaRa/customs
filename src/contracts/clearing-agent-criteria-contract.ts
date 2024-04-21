import { FetchOptionsContract } from '@contracts/fetch-options-contract';

export interface ClearingAgentCriteriaContract extends FetchOptionsContract {
  code: string;
  arName: string;
  enName: string;
  agencyId: string;
  qId: string;
}
