import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingDetailsPopupComponent } from './meeting-details-popup.component';

describe('MeetingDetailsPopupComponent', () => {
  let component: MeetingDetailsPopupComponent;
  let fixture: ComponentFixture<MeetingDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeetingDetailsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
