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
}
