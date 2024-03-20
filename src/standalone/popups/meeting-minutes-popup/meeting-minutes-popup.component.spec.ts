import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingMinutesPopupComponent } from './meeting-minutes-popup.component';

describe('MeetingMinutesPopupComponent', () => {
  let component: MeetingMinutesPopupComponent;
  let fixture: ComponentFixture<MeetingMinutesPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingMinutesPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingMinutesPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
