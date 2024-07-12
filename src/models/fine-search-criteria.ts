import { Fine } from '@models/Fine';

export class FineSearchCriteria extends Fine {
  getqId!: string;
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
      getqId,
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
      getqId: controls ? [getqId] : getqId,
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
