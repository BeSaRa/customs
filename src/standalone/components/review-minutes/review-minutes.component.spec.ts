import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewMinutesComponent } from './review-minutes.component';

describe('ReviewMinutesComponent', () => {
  let component: ReviewMinutesComponent;
  let fixture: ComponentFixture<ReviewMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewMinutesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
