import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleDecisionPopupComponent } from './single-decision-popup.component';

describe('SingleDecisionPopupComponent', () => {
  let component: SingleDecisionPopupComponent;
  let fixture: ComponentFixture<SingleDecisionPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleDecisionPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SingleDecisionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
