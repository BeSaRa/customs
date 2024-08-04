import { Fine } from '@models/Fine';

export class FineSearchCriteria extends Fine {
  commercialRegistryNumber!: string;
  establishmentRegistry!: string;
  penaltyFrom!: string;
  penaltyTo!: string;
  agencyId!: number;
  agentId!: number;

  buildForm(controls = false): object {
    const {
      agencyNumber,
      investigationFileNumber,
      penaltyDecisionNumber,
      agencyId,
      agentId,
      qId,
      commercialRegistryNumber,
      establishmentRegistry,
      penaltyFrom,
      penaltyTo,
    } = this;
    return {
      agencyNumber: controls ? [agencyNumber] : agencyNumber,
      investigationFileNumber: controls
        ? [investigationFileNumber]
        : investigationFileNumber,
      penaltyDecisionNumber: controls
        ? [penaltyDecisionNumber]
        : penaltyDecisionNumber,
      agencyId: controls ? [agencyId] : agencyId,
      agentId: controls ? [agentId] : agentId,
      qId: controls ? [qId] : qId,
      commercialRegistryNumber: controls
        ? [commercialRegistryNumber]
        : commercialRegistryNumber,
      establishmentRegistry: controls
        ? [establishmentRegistry]
        : establishmentRegistry,
      penaltyFrom: controls ? [penaltyFrom] : penaltyFrom,
      penaltyTo: controls ? [penaltyTo] : penaltyTo,
    };
  }
}
