import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceCompletePopupComponent } from './grievance-complete-popup.component';

describe('GrievanceCompletePopupComponent', () => {
  let component: GrievanceCompletePopupComponent;
  let fixture: ComponentFixture<GrievanceCompletePopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceCompletePopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrievanceCompletePopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
