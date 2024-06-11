import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPaymentPopupComponent } from './add-payment-popup.component';

describe('AddPaymentComponent', () => {
  let component: AddPaymentPopupComponent;
  let fixture: ComponentFixture<AddPaymentPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddPaymentPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AddPaymentPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
