import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDecisionPopupComponent } from './court-decision-popup.component';

describe('CourtDecisionPopupComponent', () => {
  let component: CourtDecisionPopupComponent;
  let fixture: ComponentFixture<CourtDecisionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtDecisionPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDecisionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
