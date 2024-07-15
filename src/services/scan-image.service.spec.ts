import { TestBed } from '@angular/core/testing';

import { ScanImageService } from './scan-image.service';

describe('ScanImageService', () => {
  let service: ScanImageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScanImageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
