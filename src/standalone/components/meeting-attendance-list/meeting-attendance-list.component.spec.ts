import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAttendanceListComponent } from './meeting-attendance-list.component';

describe('AttendanceComponent', () => {
  let component: MeetingAttendanceListComponent;
  let fixture: ComponentFixture<MeetingAttendanceListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingAttendanceListComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingAttendanceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
