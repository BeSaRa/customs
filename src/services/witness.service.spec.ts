import { TestBed } from '@angular/core/testing';
import { WitnessService } from './witness.service';

describe('WitnessService', () => {
  let service: WitnessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WitnessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
