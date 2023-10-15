import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationPopupComponent } from './violation-popup.component';

describe('ViolationsSearchCriteriaPopupComponent', () => {
  let component: ViolationPopupComponent;
  let fixture: ComponentFixture<ViolationPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViolationPopupComponent],
    });
    fixture = TestBed.createComponent(ViolationPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
