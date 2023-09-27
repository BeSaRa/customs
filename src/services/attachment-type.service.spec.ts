import { TestBed } from '@angular/core/testing';

import { AttachmentTypeService } from './attachment-type.service';

describe('AttachmentTypeService', () => {
  let service: AttachmentTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
