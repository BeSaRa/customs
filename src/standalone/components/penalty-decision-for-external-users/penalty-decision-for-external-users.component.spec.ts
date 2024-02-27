import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyDecisionForExternalUsersComponent } from './penalty-decision-for-external-users.component';

describe('PenaltyDecisionForExternalUsersComponent', () => {
  let component: PenaltyDecisionForExternalUsersComponent;
  let fixture: ComponentFixture<PenaltyDecisionForExternalUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PenaltyDecisionForExternalUsersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PenaltyDecisionForExternalUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
