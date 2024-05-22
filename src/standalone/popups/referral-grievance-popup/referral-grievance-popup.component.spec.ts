import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralGrievancePopupComponent } from './referral-grievance-popup.component';

describe('ReferralGrievancePopupComponent', () => {
  let component: ReferralGrievancePopupComponent;
  let fixture: ComponentFixture<ReferralGrievancePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralGrievancePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralGrievancePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
