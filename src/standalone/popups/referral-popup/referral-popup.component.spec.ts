import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralPopupComponent } from './referral-popup.component';

describe('SingleReferralPopupComponent', () => {
  let component: ReferralPopupComponent;
  let fixture: ComponentFixture<ReferralPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReferralPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReferralPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
