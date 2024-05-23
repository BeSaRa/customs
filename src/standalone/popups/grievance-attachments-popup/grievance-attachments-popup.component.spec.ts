import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceAttachmentsPopupComponent } from './grievance-attachments-popup.component';

describe('GrievanceAttachmentsPopupComponent', () => {
  let component: GrievanceAttachmentsPopupComponent;
  let fixture: ComponentFixture<GrievanceAttachmentsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GrievanceAttachmentsPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(GrievanceAttachmentsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
