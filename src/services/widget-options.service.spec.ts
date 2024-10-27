import { TestBed } from '@angular/core/testing';

import { WidgetOptionsService } from './widget-options.service';

describe('WidgetOptionsService', () => {
  let service: WidgetOptionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WidgetOptionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
