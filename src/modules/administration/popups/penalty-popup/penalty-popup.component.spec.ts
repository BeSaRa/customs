import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PenaltyPopupComponent } from './penalty-popup.component';

describe('PenaltyPopupComponent', () => {
  let component: PenaltyPopupComponent;
  let fixture: ComponentFixture<PenaltyPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PenaltyPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PenaltyPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
