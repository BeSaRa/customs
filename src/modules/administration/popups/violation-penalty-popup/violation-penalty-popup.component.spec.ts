import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViolationPenaltyPopupComponent } from './violation-penalty-popup.component';

describe('ViolationPenaltyPopupComponent', () => {
  let component: ViolationPenaltyPopupComponent;
  let fixture: ComponentFixture<ViolationPenaltyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViolationPenaltyPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ViolationPenaltyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
