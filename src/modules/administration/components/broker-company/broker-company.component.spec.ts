import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrokerCompanyComponent } from './broker-company.component';

describe('BrokerCompanyComponent', () => {
  let component: BrokerCompanyComponent;
  let fixture: ComponentFixture<BrokerCompanyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BrokerCompanyComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BrokerCompanyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
