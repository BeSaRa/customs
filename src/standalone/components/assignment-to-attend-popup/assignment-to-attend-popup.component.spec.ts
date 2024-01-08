import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentToAttendPopupComponent } from './assignment-to-attend-popup.component';

describe('AssignmentToAttendPopupComponent', () => {
  let component: AssignmentToAttendPopupComponent;
  let fixture: ComponentFixture<AssignmentToAttendPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AssignmentToAttendPopupComponent],
    });
    fixture = TestBed.createComponent(AssignmentToAttendPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
