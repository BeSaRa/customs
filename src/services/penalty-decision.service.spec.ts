import { TestBed, inject } from "@angular/core/testing";
import { PenaltyDecisionService } from "./penalty-decision.service";

describe("Service: PenaltyDecision", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PenaltyDecisionService],
    });
  });

  it("should ...", inject(
    [PenaltyDecisionService],
    (service: PenaltyDecisionService) => {
      expect(service).toBeTruthy();
    }
  ));
});
