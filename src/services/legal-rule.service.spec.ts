import { TestBed } from '@angular/core/testing';

import { LegalRuleService } from './legal-rule.service';
  
describe('LegalRuleService', () => {
  let service: LegalRuleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LegalRuleService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
