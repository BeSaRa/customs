import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtDecisionListComponent } from './court-decision-list.component';

describe('CourtDecisionListComponent', () => {
  let component: CourtDecisionListComponent;
  let fixture: ComponentFixture<CourtDecisionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtDecisionListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CourtDecisionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
