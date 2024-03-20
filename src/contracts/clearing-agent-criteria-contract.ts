interface FetchOptionsContracts {}

export interface ClearingAgentCriteriaContract extends FetchOptionsContracts {
  code: string;
  arName: string;
  enName: string;
  agencyId: string;
  qId: string;
}
