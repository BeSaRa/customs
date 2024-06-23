import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDecisionsComponent } from './court-decisions.component';

describe('CourtJudgmentComponent', () => {
  let component: CourtDecisionsComponent;
  let fixture: ComponentFixture<CourtDecisionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourtDecisionsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDecisionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
