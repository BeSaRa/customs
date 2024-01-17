import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakePenaltyDecisionPopupComponent } from './make-penalty-decision-popup.component';

describe('MakePenaltyDecisionPopupComponent', () => {
  let component: MakePenaltyDecisionPopupComponent;
  let fixture: ComponentFixture<MakePenaltyDecisionPopupComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MakePenaltyDecisionPopupComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakePenaltyDecisionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
