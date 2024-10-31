export interface ActivityPropertiesContract {
  DecisionFullSerial: {
    value: string | null;
  };
  IsDecision: {
    value: boolean;
  };
  ConcernedId: {
    value: number;
  };
  OffenderId: {
    value: number;
  };
  OffenderIds: {
    value: {
      items: number[];
    };
  };
  OffenderType: {
    value: number;
  };
  Description: {
    value: string;
  };
  ReviewerOuId: {
    value: number;
  };
  Reply: {
    value: string;
  };
  Serial: {
    value: string;
  };
  DescriptionId: {
    value: number;
  };
}
