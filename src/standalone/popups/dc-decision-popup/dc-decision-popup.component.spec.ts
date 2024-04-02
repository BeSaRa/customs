import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DcDecisionPopupComponent } from './dc-decision-popup.component';

describe('SingleDecisionPopupComponent', () => {
  let component: DcDecisionPopupComponent;
  let fixture: ComponentFixture<DcDecisionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DcDecisionPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DcDecisionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
