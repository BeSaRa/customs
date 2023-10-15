import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationListComponent } from './violation-list.component';

describe('ViolationListComponent', () => {
  let component: ViolationListComponent;
  let fixture: ComponentFixture<ViolationListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViolationListComponent],
    });
    fixture = TestBed.createComponent(ViolationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
