import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesComponent } from './meeting-minutes.component';

describe('MeetingsListComponent', () => {
  let component: MeetingMinutesComponent;
  let fixture: ComponentFixture<MeetingMinutesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingMinutesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingMinutesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
