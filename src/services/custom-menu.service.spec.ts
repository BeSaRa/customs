import { TestBed } from '@angular/core/testing';

import { CustomMenuService } from './custom-menu.service';
  
describe('CustomMenuService', () => {
  let service: CustomMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomMenuService);
  });
  
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
