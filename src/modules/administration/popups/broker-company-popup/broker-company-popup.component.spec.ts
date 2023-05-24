import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCompanyPopupComponent } from './broker-company-popup.component';

describe('BrokerCompanyPopupComponent', () => {
  let component: BrokerCompanyPopupComponent;
  let fixture: ComponentFixture<BrokerCompanyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrokerCompanyPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerCompanyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
