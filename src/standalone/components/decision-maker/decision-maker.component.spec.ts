import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DecisionMakerComponent } from './decision-maker.component';

describe('DecisionMakerComponent', () => {
  let component: DecisionMakerComponent;
  let fixture: ComponentFixture<DecisionMakerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DecisionMakerComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DecisionMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
