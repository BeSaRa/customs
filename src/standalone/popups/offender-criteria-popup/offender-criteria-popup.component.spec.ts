import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OffenderCriteriaPopupComponent } from './offender-criteria-popup.component';

describe('OffenderCriteriaPopupComponent', () => {
  let component: OffenderCriteriaPopupComponent;
  let fixture: ComponentFixture<OffenderCriteriaPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OffenderCriteriaPopupComponent],
    });
    fixture = TestBed.createComponent(OffenderCriteriaPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
