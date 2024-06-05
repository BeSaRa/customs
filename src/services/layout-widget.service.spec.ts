import { TestBed } from '@angular/core/testing';

import { LayoutWidgetService } from './layout-widget.service';

describe('LayoutWidgetService', () => {
  let service: LayoutWidgetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LayoutWidgetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
