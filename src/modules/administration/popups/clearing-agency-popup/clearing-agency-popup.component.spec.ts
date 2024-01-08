import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClearingAgencyPopupComponent } from './clearing-agency-popup.component';

describe('ClearingAgencyPopupComponent', () => {
  let component: ClearingAgencyPopupComponent;
  let fixture: ComponentFixture<ClearingAgencyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ClearingAgencyPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClearingAgencyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
