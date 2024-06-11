import { Fine } from '@models/Fine';

export class FineSearchCriteria extends Fine {
  getqId!: string;
  commercialRegistryNumber!: string;
  establishmentRegistry!: string;
  penaltyFrom!: string;
  penaltyTo!: string;

  buildForm(controls = false): object {
    const {
      agencyNumber,
      investigationFileNumber,
      penaltyDecisionNumber,
      agencyName,
      agentName,
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
      agencyName: controls ? [agencyName] : agencyName,
      agentName: controls ? [agentName] : agentName,
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
