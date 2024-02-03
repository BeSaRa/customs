import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestReferralPopupComponent } from './request-referral-popup.component';

describe('SingleReferralPopupComponent', () => {
  let component: RequestReferralPopupComponent;
  let fixture: ComponentFixture<RequestReferralPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RequestReferralPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RequestReferralPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
